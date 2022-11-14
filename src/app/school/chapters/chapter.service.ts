import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chapter } from './chapter';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  readonly schoolApi = environment.schoolApi;

  constructor(
    private http: HttpClient,
  ) { }

  fetchAllChapters(courseId: any): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.schoolApi}/chapters?courseId=${courseId}`)
      .pipe(shareReplay());
  }

  AddChapter(chapter: any): Observable<any> {
    return this.http.post<any>(`${this.schoolApi}/chapters`, chapter, httpOptions)
      .pipe(shareReplay());
  }

  updateChapter(chapter: any): Observable<any> {
    return this.http.patch<any>(`${this.schoolApi}/chapters/${chapter.id}`, chapter, httpOptions)
      .pipe(shareReplay());
  }

  deleteChapter(chapterId: any): Observable<any> {
    return this.http.delete<any>(`${this.schoolApi}/chapters/${chapterId}`, httpOptions)
      .pipe(shareReplay());
  }

}
