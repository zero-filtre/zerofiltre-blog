import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Section } from '../courses/course';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  readonly schoolApi = environment.schoolApi;
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  fetchAllSections(courseId: any): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiServerUrl}/section?courseId=${courseId}`)
      .pipe(shareReplay());
  }

  findSectionById(sectionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/course/${sectionId}`)
      .pipe(shareReplay());
  }

  AddSection(section: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/section`, section, httpOptions)
      .pipe(shareReplay());
  }

  updateSection(section: Section): Observable<any> {
    return this.http.patch<any>(`${this.apiServerUrl}/section`, section, httpOptions)
      .pipe(shareReplay());
  }

  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/section/${sectionId}`, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay());
  }
}
