import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../school/courses/course';
import { PaymentConfig } from '../school/studentCourse';
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

  openPaymentDialog(payload: any, type: string, course: Course = null): void {
    this.dialogPaymentRef.open(PaymentPopupComponent, {
      panelClass: 'payment-popup',
      data: {
        payload,
        type,
        course
      }
    });
  }

  checkoutProPlanMonthly(data: PaymentConfig): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }

  checkoutProPlanYearly(data: PaymentConfig): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }

  checkoutBasicOneTime(data: PaymentConfig): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }

  checkoutBasicThreeTimes(data: PaymentConfig): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/payment/checkout`, data, {
      ...httpOptions,
      responseType: 'text' as 'json'
    })
      .pipe(shareReplay())
  }
}
