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
    return this.http.get<any>(`${this.apiServerUrl}/users/signup/check/${phone}`)
      .pipe(shareReplay());
  }

  // checkoutProPlanMonthly(data: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
  //     ...httpOptions,
  //     responseType: 'text' as 'json'
  //   })
  //     .pipe(shareReplay())
  // }

}
