import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, debounceTime, distinctUntilChanged, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { MessageService } from '../../../../services/message.service';
import { CompanyService } from '../../../features/companies/company.service';
import { Company } from '../company.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-company-search-popup',
  templateUrl: './company-search-popup.component.html',
  styleUrls: ['./company-search-popup.component.css'],
})
export class CompanySearchPopupComponent {
  public loading: boolean = false;
  public companies: Company[] = [];

  query: string = '';
  results: Company[] = [];
  private SearchText$ = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<CompanySearchPopupComponent>,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private companyService: CompanyService
  ) {}

  onSearchChange(content: string) {
    this.SearchText$.next(content);
  }

  getValue(event: Event): string {
    event.preventDefault();
    return (event.target as HTMLTextAreaElement).value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  linkCourseToCompany(companyId: number): void {
    // this.loading = true;

    const {
      course: { id },
    } = this.data;
    const bodyData = { courseId: id, companyId };

    this.companyService
      .linkCourseToCompany(bodyData)
      .pipe(
        catchError((err) => {
          this.loading = false;
          return throwError(() => err?.message);
        })
      )
      .subscribe((message: string) => {
        this.loading = false;
        this.dialogRef.close();
        this.messageService.openSnackBarSuccess('La liaison a bien été créé', "");
      });
  }

  fetchAllCompanies(): void {
    this.loading = true;
    this.companyService
      .getCompanies(0, 100)
      .subscribe(({ content }: any) => {
        this.loading = false;
        this.companies = content as Company[];
        this.results.push(...content);
      });
  }

  onChanges(element: Observable<string>): void {
    element
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          // if (query.length >= 3) {
            return this.companyService.search(query, this.companies).pipe(
              catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
              }),
              tap((data: Company[]) => {
                this.results = data
              })
            );
          // } else {
          //   this.results = [];
          //   return new Observable((observer) => observer.next({ results: [] }));
          // }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.fetchAllCompanies();
    this.onChanges(this.SearchText$);
  }
}
