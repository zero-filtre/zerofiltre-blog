import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

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
  ) { }

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
