import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentProMonth, PaymentProYear, PaymentBasicOne, PaymentBasicThree } from '../school/studentCourse';
import { PaymentPopupComponent } from '../shared/payment-popup/payment-popup.component';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    public dialogPaymentRef: MatDialog,
    ) { }

  openPaymentDialog(payload: any, type: string): void {
    this.dialogPaymentRef.open(PaymentPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        payload,
        type
      }
    });
  }

  checkoutProPlanMonthly(data: PaymentProMonth): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }

  checkoutProPlanYearly(data: PaymentProYear): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }

  checkoutBasicOneTime(data: PaymentBasicOne): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }

  checkoutBasicThreeTimes(data: PaymentBasicThree): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }
}
