import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Observable, shareReplay, tap } from 'rxjs';
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
  readonly apiServerUrl = 'https://wachatgpt.zerofiltre.tech/app';

  constructor(
    private http: HttpClient,
  ) { }

  saveTokenToLS(token: string, expiryDate: string) {
    localStorage.setItem('_bot_token', token);
    localStorage.setItem('_bot_token_expiry', expiryDate);
  }

  getToken() {
    return localStorage.getItem('_bot_token');
  }

  validToken() {
    const tokenExpiresIn = +localStorage.getItem('_bot_token_expiry');
    const todayTime = Math.floor(new Date().getTime() / 1000.0);

    if (todayTime > tokenExpiresIn) return false;
    return true;
  }

  logout() {
    localStorage.removeItem('_bot_token');
    localStorage.removeItem('_bot_token_expiry');
  }

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

  getUser(): Observable<any> { 
    return this.http.get<any>(`${this.apiServerUrl}/users`, httpOptions)
      .pipe(shareReplay());
  }

  updateUser(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiServerUrl}/users`, data, httpOptions)
      .pipe(shareReplay());
  }

  getUserStats(): Observable<any> { 
    return this.http.get<any>(`${this.apiServerUrl}/users/stats?days=13`, httpOptions)
      .pipe(shareReplay());
  }

  sendCode(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/users/send_code`, data, httpOptions)
      .pipe(
        tap(({ verification_id }) => localStorage.setItem('_verification_id', verification_id)),
        shareReplay()
      );
  }

  verifyCode(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/users/verify_code`, data, httpOptions)
      .pipe(shareReplay());
  }

}
