import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductType, ModeType } from '../school/studentCourse';
import { PaymentPopupComponent } from '../shared/payment-popup/payment-popup.component';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

interface PaymentPro {
  productId: number,
  productType: ProductType[0],
  mode: ModeType[0],
  proPlan: boolean
}

interface PaymentBasicOne {
  productId: number,
  productType: ProductType[0],
  mode: ModeType[1],
}

interface PaymentBasicThree {
  productId: number,
  productType: ProductType[0],
  mode: ModeType[0],
  proPlan?: boolean
}

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

  checkoutProPlan(data: PaymentPro): Observable<any> {
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
