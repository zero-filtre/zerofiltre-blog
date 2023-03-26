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
    (window as any).open(url, "_blank");
  }

  payOneTime() {
    this.payload = { ...this.payload, mode: 'payment' }
    this.payment.checkoutBasicOneTime(this.payload)
      .subscribe(data => {
        this.goToUrl(data);
        this.dialogRef.close();
      })
  }

  payThreeTimes() {
    this.payload = { ...this.payload, mode: 'subscription', proPlan: false }
    this.payment.checkoutBasicThreeTimes(this.payload)
      .subscribe(data => {
        this.goToUrl(data);
        this.dialogRef.close();
      })
  }

  payProMonthly() {
    this.payload = { ...this.payload, mode: 'subscription', proPlan: true, recurringInterval: 'month' }
    this.payment.checkoutProPlanMonthly(this.payload)
      .subscribe(data => {
        this.goToUrl(data);
        this.dialogRef.close();
      })
  }

  payProYearly() {
    this.payload = { ...this.payload, mode: 'subscription', proPlan: true, recurringInterval: 'year' }
    this.payment.checkoutProPlanYearly(this.payload)
      .subscribe(data => {
        this.goToUrl(data);
        this.dialogRef.close();
      })
  }

  ngOnInit(): void {
    this.payload = this.data.payload;
    this.type = this.data.type;
    this.course = this.data.course;
  }

}
