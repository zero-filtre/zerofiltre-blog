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
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  fetchAllChapters(courseId: any): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.apiServerUrl}/chapters?courseId=${courseId}`)
      .pipe(shareReplay());
  }

  AddChapter(data: any): Observable<any> {
    const { title, courseId } = data
    return this.http.post<any>(`${this.apiServerUrl}/chapter?title=${title}&courseId=${courseId}`, httpOptions)
      .pipe(shareReplay());
  }

  updateChapter(chapter: any): Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/chapter/${chapter.id}`, chapter, httpOptions)
      .pipe(shareReplay());
  }

  deleteChapter(chapterId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/chapter/${chapterId}`, httpOptions)
      .pipe(shareReplay());
  }

}
