// geo-location.service.ts
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  private apiUrl = 'https://ipinfo.io/json';

  constructor(private http: HttpClient) {}

  getUserLocation(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(shareReplay());
  }
}
