import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/user/auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  readonly schoolApi = environment.schoolApi;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  get canCreateCourse(): boolean {
    return this.auth.isAdmin;
  }

  subscribeCourse(data: any) {
    return this.http.post<any>(`${this.schoolApi}/courseSubscriptions`, data, httpOptions)
      .pipe(shareReplay());
  }

  getSubscribedCourse(courseId: any, userId: any) {
    return this.http.get<any>(`${this.schoolApi}/courseSubscriptions?courseId=${courseId}&userId=${userId}`, httpOptions)
      .pipe(shareReplay());
  }

  getAllSubscribedCourse(userId: any) {
    return this.http.get<any>(`${this.schoolApi}/courseSubscriptions?userId=${userId}`, httpOptions)
      .pipe(shareReplay());
  }

  fetchAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.schoolApi}/courses`)
      .pipe(shareReplay());
  }

  findCourseById(courseId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/courses/${courseId}`)
      .pipe(shareReplay());
  }

  initCourse(course: any): Observable<any> {
    return this.http.post<any>(`${this.schoolApi}/courses`, course, httpOptions)
      .pipe(shareReplay());
  }

  AddCourse(course: any): Observable<any> {
    return this.http.post<any>(`${this.schoolApi}/courses`, course, httpOptions)
      .pipe(shareReplay());
  }

  updateCourse(course: any): Observable<any> {
    return this.http.patch<any>(`${this.schoolApi}/courses/${course.id}`, course, httpOptions)
      .pipe(shareReplay());
  }

  deleteCourse(courseId: any): Observable<any> {
    return this.http.delete<any>(`${this.schoolApi}/courses/${courseId}`, httpOptions)
      .pipe(shareReplay());
  }
}
