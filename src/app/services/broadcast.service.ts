import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  disableSub(): Observable<any> {
    const params = new HttpParams().set('subscribe', 'false');

    return this.http.post(`${this.apiServerUrl}/user/broadcast`, null, {
      params: params,
      responseType: 'text' as 'json'
    })
    .pipe(shareReplay());
  }

}
