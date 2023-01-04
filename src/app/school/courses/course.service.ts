import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from './course';
import { CourseSubscription } from '../studentCourse';
import { User } from 'src/app/user/user.model';

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
    // private auth: AuthService
  ) { }

  isSubscriber(user: User, course: Course) {
    if (!user) return false;
    return user?.courseIds?.includes(course?.id);
  }

  canCreateCourse(user: User): boolean {
    if (!user) return false;
    return user.roles.includes("ROLE_ADMIN");
  }

  canAccessCourse(user: User, courseId: any): boolean {
    if (!user) return false;
    return user?.courseIds?.includes(courseId) || this.canCreateCourse(user)
  }

  canEditCourse(user: User, course: Course): boolean {
    if (!user) return false;
    return course?.author?.id === user.id || course?.editorIds?.includes(user.id) || this.canCreateCourse(user);
  }


  subscribeCourse(data: any): Observable<any> {
    return this.http.post<any>(`${this.schoolApi}/CourseSubscriptions`, data, httpOptions)
      .pipe(shareReplay());
  }

  deleteSubscriptionCourse(courseId: any, userId: any): Observable<any> {
    return this.http.delete<any>(`${this.schoolApi}/CourseSubscriptions/course/${courseId}/user/${userId}`, httpOptions)
      .pipe(shareReplay());
  }

  findSubscribedByCourseId(courseId: any, userId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/CourseSubscriptions?courseId=${courseId}&userId=${userId}`, httpOptions)
      .pipe(
        map(data => data[0]),
        shareReplay()
      );
  }

  getAllSubscribedCourse(userId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/CourseSubscriptions?userId=${userId}`, httpOptions)
      .pipe(
        shareReplay()
      );
  }

  getAllSubscribedCourseIds(userId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/CourseSubscriptions?userId=${userId}`, httpOptions)
      .pipe(
        map((data: CourseSubscription[]) => data.map(d => d.courseId)),
        shareReplay()
      );
  }

  toggleCourseLessonProgressComplete(data: any): Observable<any> {
    const { subscriptionId, payload } = data
    return this.http.patch<any>(`${this.schoolApi}/courseSubscriptions/${subscriptionId}`, payload, httpOptions)
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
