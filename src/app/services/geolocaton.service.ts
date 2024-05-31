import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, shareReplay, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  private apiUrl = 'https://ipinfo.io/json';  // Another api https://ipapi.co/json
  private LOCATION_NAME = 'location';
  private subject = new BehaviorSubject<string>(null!);
  public location$ = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.getUserLocation();
  }

  private getUserLocation() {
    this.location$ = this.http.get<any>(this.apiUrl)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(({ country, city, region }: any) => {
          this.subject.next(country);
          localStorage.setItem(this.LOCATION_NAME, JSON.stringify(country));
        }),
        shareReplay()
      )
  }

  get userLocation(): string {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(this.LOCATION_NAME));
    }
    return null;
  }
}
