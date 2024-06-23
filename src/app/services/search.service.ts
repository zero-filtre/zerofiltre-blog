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
export class SearchService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    return of(query)
    return this.http
      .get<any>(`${this.apiServerUrl}/search?q=${query}`, httpOptions)
      .pipe(shareReplay());
  }
}
