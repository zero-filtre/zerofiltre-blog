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
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
  ) { }


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

  // STUDENT START

  isSubscriber(user: User, course: Course) {
    if (!user) return false;
    return user?.courseIds?.includes(course?.id);
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

  getAllSubscribedCourseCompletedIds(userId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/CourseSubscriptions?userId=${userId}`, httpOptions)
      .pipe(
        map((data: CourseSubscription[]) => data.filter(d => d.completed).map(d => d.courseId)),
        shareReplay()
      );
  }

  getAllSubscribedCourseInProgressIds(userId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/CourseSubscriptions?userId=${userId}`, httpOptions)
      .pipe(
        map((data: CourseSubscription[]) => data.filter(d => !d.completed).map(d => d.courseId)),
        shareReplay()
      );
  }

  toggleCourseLessonProgressComplete(data: any): Observable<any> {
    const { subscriptionId, payload } = data
    return this.http.patch<any>(`${this.schoolApi}/courseSubscriptions/${subscriptionId}`, payload, httpOptions)
      .pipe(shareReplay());
  }


  // TEACHER START

  isAuthor(user: User, course: Course) {
    if (!user) return false;
    return course?.author?.id == user.id;
  }

  getAllMyCreatedCoursesByStatus(pageNumber: any, limit: any, status: string) {
    return this.http.get<any[]>(`${this.apiServerUrl}/user/courses?pageNumber=${pageNumber}&pageSize=${limit}&status=${status}`)
      .pipe(shareReplay());
  }

  // COMMON START

  fetchAllCourses(pageNumber: any, limit: any, status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/course?pageNumber=${pageNumber}&pageSize=${limit}&status=${status}`)
      .pipe(shareReplay());
  }

  fetchAllCoursesByFilter(pageNumber: any, limit: any, status: string, filter = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/course?pageNumber=${pageNumber}&pageSize=${limit}&status=${status}` + (filter != '' ? `&filter=${filter}` : ``), httpOptions)
      .pipe(shareReplay());
  }

  findAllArticlesByTag(page: number, limit: number, tagName: string): Observable<Course[]> {
    return this.http.get<any>(`${this.apiServerUrl}/course?pageNumber=${page}&pageSize=${limit}&status=published&tag=${tagName}`, httpOptions)
      .pipe(shareReplay());
  }

  findCourseById(courseId: any): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/course/${courseId}`, httpOptions)
      .pipe(shareReplay());
  }

  initCourse(courseTitle: string): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/course?title=${courseTitle}`, httpOptions)
      .pipe(shareReplay());
  }

  updateCourse(course: any): Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/course`, course, httpOptions)
      .pipe(shareReplay());
  }

  deleteCourse(courseId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/course/${courseId}`, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay());
  }

  addReactionToCourse(courseId: string, action: string): Observable<any> {
    return this.http.post<string>(`${this.apiServerUrl}/reaction?articleId=0&courseId=${courseId}&action=${action}`, {})
      .pipe(shareReplay());
  }
}
