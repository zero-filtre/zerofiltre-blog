import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from './course';
import { CourseEnrollment } from '../studentCourse';
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


  isAdminUser(user: User){
    if (!user) return false;
    return user.roles.includes("ROLE_ADMIN");
  }

  isProUser(user: User){
    if (!user) return false;
    return user.pro
  }

  canCreateCourse(user: User): boolean {
    if (!user) return false;
    return this.isAdminUser(user) || true;
  }

  canAccessCourse(user: User, course: Course): boolean {
    if (!user) return false;
    return course?.author?.id === user.id || course?.editorIds?.includes(user.id) || this.isAdminUser(user) || this.isSubscriber(course?.id);
  }

  canEditCourse(user: User, course: Course): boolean {
    if (!user) return false;
    return course?.author?.id === user.id || course?.editorIds?.includes(user.id) || this.isAdminUser(user) 
  }

  // STUDENT EnrollmentS START

  isSubscriber(courseId: any) {
    const subIds = JSON.parse(localStorage?.getItem('_subs'));
    return subIds?.includes(courseId);
  }

  subscribeToCourse(courseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/enrollment?courseId=${courseId}`, httpOptions)
      .pipe(
        tap((data: CourseEnrollment) => {
          const subIds = JSON.parse(localStorage?.getItem('_subs'));
          localStorage?.setItem('_subs', JSON.stringify([...subIds, data.id]));
        }),
        shareReplay()
      );
  }

  deleteEnrollmentCourse(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/enrollment?course=${courseId}`, httpOptions)
      .pipe(shareReplay());
  }

  findSubscribedByCourseId(data: any): Observable<any> {
    const { courseId, userId } = data
    return this.http.get<any>(`${this.apiServerUrl}/enrollment?courseId=${courseId}&userId=${userId}`, httpOptions)
      .pipe(shareReplay());
  }

  findAllSubscribedCourses(data: any): Observable<any> {
    const { pageNumber, pageSize, completed } = data
    return this.http.get<any>(`${this.apiServerUrl}/enrollment/user?pageNumber=${pageNumber}&pageSize=${pageSize}` + (completed == 'completed' ? '&filter=completed' : ''), httpOptions)
      .pipe(shareReplay());
  }

  markLessonAsComplete(data: any): Observable<any> {
    const { courseId, lessonId } = data
    return this.http.patch<any>(`${this.apiServerUrl}/enrollment/complete?lessonId=${lessonId}&courseId=${courseId}`, httpOptions)
      .pipe(shareReplay());
  }

  markLessonAsInComplete(data: any): Observable<any> {
    const { courseId, lessonId } = data
    return this.http.patch<any>(`${this.apiServerUrl}/enrollment/uncomplete?lessonId=${lessonId}&courseId=${courseId}`, httpOptions)
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

  findAllCoursesByTag(page: number, limit: number, tagName: string): Observable<Course[]> {
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

  updateCourse(course: Course): Observable<any> {
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

  addReactionToCourse(courseId: number, action: string): Observable<any> {
    return this.http.post<string>(`${this.apiServerUrl}/reaction?articleId=0&courseId=${courseId}&action=${action}`, {})
      .pipe(shareReplay());
  }

  publishCourse(course: Course){
    return this.http.patch<any>(`${this.apiServerUrl}/course/publish`, course, httpOptions)
      .pipe(shareReplay());
  }

  moveLesson(chapterId: any, lessonId: any, position: any): Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/chapter/${chapterId}/lesson/${lessonId}?toNumber=${position}`, null, httpOptions)
      .pipe(shareReplay());
  }

  moveChapter(chapterId: any, position: any): Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/chapter/${chapterId}?toNumber=${position}`, null, httpOptions)
      .pipe(shareReplay());
  }
}
