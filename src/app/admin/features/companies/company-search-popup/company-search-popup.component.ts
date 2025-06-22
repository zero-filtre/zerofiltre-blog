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
  selectedUsers: { id: number, profilePicture?: string, role?: string, fullName?: string, companyName?: string, siren?: string, title?: string }[] = [];
  results: any[] = [];
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

  linkCourseAndCompany(companyId: number): void {
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
        // this.dialogRef.close('La liaison a bien été créé');
        this.messageService.openSnackBarSuccess("Le cours a été ajouté à l'organisation avec succès !", 'OK');
      });
  }

  addCourseToCompany(courseId: number): void {
    const selectedUser = this.selectedUsers.find(someCourse => someCourse.id === courseId);
    const resultUser = this.results.find(someCourse => someCourse.id === courseId);

    const {
      company: { id },
    } = this.data;
    const bodyData = { courseId, companyId: id };

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
        // this.dialogRef.close('La liaison a bien été créé');
        this.messageService.openSnackBarSuccess("Le cours a été ajouté à l'organisation avec succès !", 'OK');
      });
  }

  addUserToCompany(userId: number): void {
    const selectedUser = this.selectedUsers.find(someUser => someUser.id === userId);
    const resultUser = this.results.find(someUser => someUser.id === userId);
    const role = selectedUser ? selectedUser.role : (resultUser && resultUser.role) ? resultUser.role : 'VIEWER';
    
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
        // this.dialogRef.close("L'utilisateur a bien été ajouté à la société"); A utiliser pour la selection multiple
        this.messageService.openSnackBarSuccess("L'utilisateur a été ajouté à cette organisation avec succès !", 'OK');
      });
  }

  fetchAllCompanies(): void {
    this.loading = true;
    this.companyService.getCompanies(0, 100).subscribe(({ content }: any) => {
      this.loading = false;
      this.results.push(...content);
    });
  }

  setDataSource() {
    const companies = this.companyService.companies;
    const users = this.companyService.users;
    const courses = this.companyService.courses;

    if (this.data.dataType == "Course") {
      this.results.push(...courses);
    } else if (this.data.dataType == "User") {
      this.results.push(...users);
    } else {
      this.results.push(...companies);
    }
  }

  linkCourseOrUserToCompany(dataId: number): void {
    if (this.data.dataType == "Course") {
      this.addCourseToCompany(dataId);
    } else if (this.data.dataType == "User") {
      this.addUserToCompany(dataId);
    } else {
      this.linkCourseAndCompany(dataId);
    }
  }

  onChanges(element: Observable<string>): void {
    element
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          const safeQuery = query.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          if (safeQuery.length >= 3) {
            return this.companyService.search(safeQuery, this.data.dataType).pipe(
              catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
              }),
              tap((data: Company[]) => {
                this.results = data;
              })
            );
          } else {
            this.results = [];
            return new Observable((observer) => observer.next({ results: [] }));
          }
        })
      )
      .subscribe();
  }


  isSelected(userId: number): boolean {
    return this.selectedUsers.some(user => user.id === userId);
  }

  toggleSelection(user: any) {
    const index = this.selectedUsers.findIndex(someUser => someUser.id === user.id);

    const resultUser = this.results.find(someUser => someUser.id === user.id);
    const role = (resultUser && resultUser.role) ? resultUser.role : 'VIEWER';

    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push({ id: user.id, profilePicture: user.profilePicture, role, fullName: user.fullName, companyName: user.companyName, siren: user.siren, title: user.title });
    }
  }

  updateUserRole(userId: number, role: string) {
    const user = this.selectedUsers.find(someUser => someUser.id === userId);
    if (user) {
      user.role = role;
    } 
    
    const resultUser = this.results.find(someUser => someUser.id === userId);
    if (resultUser) {
      resultUser.role = role;
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

  sendLinkRequest(users: { id: number, role?: string, companyName?: string, siren?: string }[]) {
    // const { company: { id } } = this.data;
    // const { company: { id: companyId } } = this.data;
    // const { course: { id: courseId } } = this.data;
    
    // const bodyData = { users, companyId: id };

    console.log("Envoi de la liaison avec :", users);
    this.messageService.openSnackBarError("API d'ajout de users en masse pas encore disponible...!", "")
  }


  
  ngOnInit(): void {
    this.setDataSource();
    this.onChanges(this.SearchText$);
  }
}
