import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class BotService {
  // readonly apiServerUrl = environment.apiBaseUrl;
  readonly apiServerUrl = 'https://wachatgptpremium.zerofiltre.tech/app';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  isSignup(phone: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/users/signup/check/${phone}`, httpOptions)
      .pipe(shareReplay());
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/users/signup`, data, httpOptions)
      .pipe(shareReplay());
  }

  signin(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/users/signin`, data, httpOptions)
      .pipe(shareReplay());
  }

  getUser(token: string): Observable<any> { // Need a token to retrieve the user, the token comes from the signin
    httpOptions.headers = httpOptions.headers
      .set('Authorization', `Bearer ${token}`)

    return this.http.get<any>(`${this.apiServerUrl}/users`, httpOptions)
      .pipe(shareReplay());
  }

  updateUser(data: any, token: string): Observable<any> { // Need a token to retrieve the user, the token comes from the signin
    httpOptions.headers = httpOptions.headers
      .set('Authorization', `Bearer ${token}`)

    return this.http.put<any>(`${this.apiServerUrl}/users`, data, httpOptions)
      .pipe(shareReplay());
  }

  getUserStats(token: string): Observable<any> { // Need a token to retrieve the user, the token comes from the signin
    httpOptions.headers = httpOptions.headers
      .set('Authorization', `Bearer ${token}`)

    return this.http.get<any>(`${this.apiServerUrl}/users/stats`, httpOptions)
      .pipe(shareReplay());
  }

}
