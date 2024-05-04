import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

const apiBase = 'https://api.vimeo.com';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  saveSurveyResults(json: string): Observable<any> {
    const data = JSON.stringify(json)
    return this.http.patch<any>(`${apiBase}/nps`, data, httpOptions)
      .pipe(shareReplay())
  }
}
