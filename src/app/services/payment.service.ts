import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductType, ModeType } from '../school/studentCourse';


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

  constructor(private http: HttpClient) { }

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
