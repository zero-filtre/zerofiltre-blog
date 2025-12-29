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

  private canBeEdited = new BehaviorSubject<boolean>(false);
  canBeEdited$ = this.canBeEdited.asObservable();

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

  setModeEditCourse(canBeEdited: boolean) {
    this.canBeEdited.next(canBeEdited);
  }

  reset() {
    this.isAdmin.next(false);
    this.userRoleInCompany.next(null);
    this.companyId.next(null);
    this.isExclusiveCourse.next(false);
    this.canBeEdited.next(false);
  }
}