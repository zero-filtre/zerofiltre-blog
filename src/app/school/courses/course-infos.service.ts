import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CourseInfosService {
  private isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdmin.asObservable();

  private userRoleInCompany = new BehaviorSubject<string>(null);
  userRoleInCompany$ = this.userRoleInCompany.asObservable();

  private companyId = new BehaviorSubject<string>(null);
  companyId$ = this.companyId.asObservable();

  private isExclusiveCourse = new BehaviorSubject<boolean>(false);
  isExclusiveCourse$ = this.isExclusiveCourse.asObservable();

  private isEditCourse = new BehaviorSubject<boolean>(false);
  isEditCourse$ = this.isEditCourse.asObservable();

  setAdmin(isAdmin: boolean) {
    this.isAdmin.next(isAdmin);
  }

  setUserCompanyRole(userRoleInCompany: string) {
    this.userRoleInCompany.next(userRoleInCompany);
  }

  setCompanyId(companyId: string) {
    this.companyId.next(companyId);
  }

  setExclusiveCourse(isExclusiveCourse: boolean) {
    this.isExclusiveCourse.next(isExclusiveCourse);
  }

  setModeEditCourse(isEditCourse: boolean) {
    this.isEditCourse.next(isEditCourse);
  }

  reset() {
    this.isAdmin.next(false);
    this.userRoleInCompany.next(null);
    this.companyId.next(null);
    this.isExclusiveCourse.next(false);
    this.isEditCourse.next(false);
  }
}