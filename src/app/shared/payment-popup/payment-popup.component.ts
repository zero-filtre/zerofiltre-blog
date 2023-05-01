import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { DOCUMENT } from '@angular/common';
import { PaymentConfig } from 'src/app/school/studentCourse';
import { Course } from 'src/app/school/courses/course';

@Component({
  selector: 'app-payment-popup',
  templateUrl: './payment-popup.component.html',
  styleUrls: ['./payment-popup.component.css']
})
export class PaymentPopupComponent implements OnInit {
  payload: PaymentConfig;
  type: string;
  course: Course;
  loadingOne: boolean
  loadingThree: boolean
  loadingMonth: boolean
  loadingYear: boolean

  constructor(
    private payment: PaymentService,
    public dialogRef: MatDialogRef<PaymentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: Document
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToUrl(url: string): void {
    // this.document.location.href = url;
    // const popup = (window as any).open(url, "_blank");
  }

  payOneTime() {
    this.loadingOne = true
    this.payload = { ...this.payload, mode: 'payment' }

    let popupWin = (window as any).open('about:blank', "_blank");

    this.payment.checkoutBasicOneTime(this.payload)
      .subscribe(data => {
        this.loadingOne = false;
        popupWin.location.href = data;
        this.dialogRef.close();
      })
  }

  payThreeTimes() {
    this.loadingThree = true;
    this.payload = { ...this.payload, mode: 'subscription', proPlan: false }

    let popupWin = (window as any).open('about:blank', "_blank");

    this.payment.checkoutBasicThreeTimes(this.payload)
      .subscribe(data => {
        this.loadingThree = false;
        popupWin.location.href = data;
        this.dialogRef.close();
      })
  }

  payProMonthly() {
    this.loadingMonth = true;
    this.payload = { ...this.payload, mode: 'subscription', proPlan: true, recurringInterval: 'month' }

    let popupWin = (window as any).open('about:blank', "_blank");

    this.payment.checkoutProPlanMonthly(this.payload)
      .subscribe(data => {
        this.loadingMonth = false;
        popupWin.location.href = data;
        this.dialogRef.close();
      })
  }

  payProYearly() {
    this.loadingYear = true;
    this.payload = { ...this.payload, mode: 'subscription', proPlan: true, recurringInterval: 'year' }

    let popupWin = (window as any).open('about:blank', "_blank");
    
    this.payment.checkoutProPlanYearly(this.payload)
      .subscribe(data => {
        this.loadingYear = false;
        popupWin.location.href = data;
        this.dialogRef.close();
      })
  }

  ngOnInit(): void {
    this.payload = this.data.payload;
    this.type = this.data.type;
    this.course = this.data.course;
  }

}
