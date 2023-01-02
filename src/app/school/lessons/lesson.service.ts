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

  constructor(
    private http: HttpClient,
  ) { }

  fetchAllLessons(courseId: any): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.schoolApi}/lessons?courseId=${courseId}`)
      .pipe(shareReplay());
  }

  findLessonById(lessonId: any, courseId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/lessons?id=${lessonId}&courseId=${courseId}`)
      .pipe(
        map(data => data[0]),
        shareReplay()
      );
  }

  findLessonByPosition(posId: any, courseId: any): Observable<any> {
    return this.http.get<any>(`${this.schoolApi}/lessons?position=${posId}&courseId=${courseId}`)
      .pipe(
        map(data => data[0]),
        shareReplay()
      );
  }

  AddLesson(lesson: any): Observable<any> {
    return this.http.post<any>(`${this.schoolApi}/lessons`, lesson, httpOptions)
      .pipe(shareReplay());
  }

  updateLesson(lesson: any): Observable<any> {
    return this.http.patch<any>(`${this.schoolApi}/lessons/${lesson.id}`, lesson, httpOptions)
      .pipe(shareReplay());
  }

  deleteLesson(lessonId: any): Observable<any> {
    return this.http.delete<any>(`${this.schoolApi}/lessons/${lessonId}`, httpOptions)
      .pipe(shareReplay());
  }

}
