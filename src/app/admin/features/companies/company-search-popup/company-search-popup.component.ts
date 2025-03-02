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
  selectedUsers: { id: number, role: string }[] = [];
  results: any[] = [];
  isCourseSearch: boolean = false;
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
      .subscribe((_message: string) => {
        this.loading = false;
        this.dialogRef.close('La liaison a bien été créé');
        this.messageService.openSnackBarSuccess("Le cours a bien été ajouté à l'organisation avec succès !", 'OK');
      });
  }

  linkUserToCompany(userId: number): void {
    const selectedUser = this.selectedUsers.find(user => user.id === userId);
    const role = selectedUser ? selectedUser.role : 'VIEWER';

    const {
      company: { id },
    } = this.data;
    const bodyData = { userId, companyId: id, role };

    this.companyService
      .linkUserToCompany(bodyData)
      .pipe(
        catchError((err) => {
          this.loading = false;
          return throwError(() => err?.message);
        })
      )
      .subscribe((_message: string) => {
        this.loading = false;
        this.dialogRef.close("L'utilisateur a bien été ajouté à la société");
        this.messageService.openSnackBarSuccess("L'utilisateur a bien été ajouté à l'organisation avec succès !", 'OK');
      });
  }

  fetchAllCompanies(): void {
    this.loading = true;
    this.companyService.getCompanies(0, 100).subscribe(({ content }: any) => {
      this.loading = false;
      this.results.push(...content);
    });
  }

  fetchAllUsers(): void {
    this.loading = true;
    this.companyService.getCompanies(0, 100).subscribe(({ content }: any) => {
      this.loading = false;
      this.results.push(...content);
    });
  }

  setDataSource() {
    const companies = this.companyService.companies;
    const users = this.companyService.users;

    if (this.data.course) {
      this.isCourseSearch = true;
      this.results.push(...companies);
    } else {
      this.isCourseSearch = false;
      this.results.push(...users);
    }
  }

  linkCourseOrUserToCompany(dataId: number): void {
    if (this.isCourseSearch) {
      this.linkCourseToCompany(dataId);
    } else {
      this.linkUserToCompany(dataId);
    }
  }

  onChanges(element: Observable<string>): void {
    element
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          // if (query.length >= 3) {
          return this.companyService.search(query, this.isCourseSearch).pipe(
            catchError((error: HttpErrorResponse) => {
              return throwError(() => error);
            }),
            tap((data: Company[]) => {
              this.results = data;
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



  toggleSelection(userId: number) {
    const index = this.selectedUsers.findIndex(user => user.id === userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push({ id: userId, role: 'VIEWER' });
    }
  }

  updateUserRole(userId: number, role: string) {
    const user = this.selectedUsers.find(user => user.id === userId);
    if (user) {
      user.role = role;
    } else {
      this.selectedUsers.push({ id: userId, role });
    }
  }

  linkCourseOrUserToCompanyBis(userId: number) {
    const selectedUser = this.selectedUsers.find(user => user.id === userId);
    const role = selectedUser ? selectedUser.role : 'VIEWER';

    this.sendLinkRequest([{ id: userId, role }]);
  }

  linkSelectedUsers() {
    if (this.selectedUsers.length === 0) {
      alert("Veuillez sélectionner au moins un utilisateur.");
      return;
    }

    this.sendLinkRequest(this.selectedUsers);
  }

  sendLinkRequest(users: { id: number, role: string }[]) {
    console.log("Envoi de la liaison avec :", users);
  }


  
  ngOnInit(): void {
    this.setDataSource();
    this.onChanges(this.SearchText$);
  }
}
