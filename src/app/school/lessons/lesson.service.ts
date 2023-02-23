import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lesson } from './lesson';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  readonly schoolApi = environment.schoolApi;
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  fetchAllLessons(courseId: any): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiServerUrl}/lesson?courseId=${courseId}`)
      .pipe(shareReplay());
  }

  findLessonById(lessonId: any): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/lesson/${lessonId}`)
      .pipe(shareReplay());
  }

  findLessonByPosition(posId: any, courseId: any): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/lesson?position=${posId}&courseId=${courseId}`)
      .pipe(
        map(data => data[0]),
        shareReplay()
      );
  }

  initLesson(data: any): Observable<any> {
    const { title, chapterId } = data
    return this.http.post<any>(`${this.apiServerUrl}/lesson?title=${title}&chapterId=${chapterId}`, httpOptions)
      .pipe(shareReplay());
  }

  updateLesson(lesson: any): Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/lesson`, lesson, httpOptions)
      .pipe(shareReplay());
  }

  deleteLesson(lessonId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/lesson/${lessonId}`, httpOptions)
      .pipe(shareReplay());
  }

}
