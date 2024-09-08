import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};


@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  saveSurveyResults(json: object): Observable<any> {
    const data = JSON.stringify(json);
    return this.http
      .post<any>(`${this.apiServerUrl}/reviews`, data, httpOptions)
      .pipe(shareReplay());
  }

  getReviews(): Observable<any> {
    return this.http
      .get<any>(`${this.apiServerUrl}/reviews`)
      .pipe(shareReplay());
  }

  getReviewById(reviewId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiServerUrl}/reviews/${reviewId}`)
      .pipe(shareReplay());
  }

  updateReviewById(reviewId: number): Observable<any> {
    return this.http
      .patch<any>(`${this.apiServerUrl}/reviews/${reviewId}`, httpOptions)
      .pipe(shareReplay());
  }

  deleteReviewById(reviewId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiServerUrl}/reviews/${reviewId}`, httpOptions)
      .pipe(shareReplay());
  }
}
