import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { DOCUMENT } from '@angular/common';
import { PaymentConfig } from 'src/app/school/studentCourse';
import { Course } from 'src/app/school/courses/course';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';
import { GeoLocationService } from 'src/app/services/geolocaton.service';

@Component({
  selector: 'app-payment-popup',
  templateUrl: './payment-popup.component.html',
  styleUrls: ['./payment-popup.component.css'],
})
export class PaymentPopupComponent implements OnInit {
  payload: PaymentConfig;
  type: string;
  course: Course;
  loadingOne: boolean;
  loadingThree: boolean;
  loadingMonth: boolean;
  loadingYear: boolean;
  loadingMonthMentored: boolean;
  country: string;

  priceCfa: number;
  priceEuro: number;
  currentPrice: { xaf: number; eur: number };
  currentPriceThreeTimes: { xaf: number; eur: number };

  constructor(
    private payment: PaymentService,
    public dialogRef: MatDialogRef<PaymentPopupComponent>,
    private router: Router,
    private notify: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private geoLocationService: GeoLocationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: Document
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToUrl(url: string): void {
    // this.document.location.href = url;
    // const popup = (window as any).open(url, "_blank");
  }

  payOneTime(byCreditCard = true) {
    if (!this.verifyAuth()) return;
    this.loadingOne = true;

    let payload: PaymentConfig = {
      ...this.payload,
      mode: 'payment',
    };

    if (!byCreditCard) {
      payload = {
        ...payload,
        currency: 'XAF',
        paymentEmail: this.authService?.currentUsr?.email,
      };
    }

    let popupWin = (window as any).open('about:blank', '_blank');

    this.payment.checkoutBasicOneTime(payload).subscribe((data) => {
      this.loadingOne = false;
      popupWin.location.href = data;
      this.dialogRef.close();
    });
  }

  payThreeTimes(byCreditCard = true) {
    if (!this.verifyAuth()) return;
    this.loadingThree = true;

    let payload: PaymentConfig = {
      ...this.payload,
      mode: 'subscription',
      proPlan: false,
    };

    if (!byCreditCard) {
      payload = {
        ...payload,
        currency: 'XAF',
        paymentEmail: this.authService?.currentUsr?.email,
      };
    }

    let popupWin = (window as any).open('about:blank', '_blank');

    this.payment.checkoutBasicThreeTimes(payload).subscribe((data) => {
      this.loadingThree = false;
      popupWin.location.href = data;
      this.dialogRef.close();
    });
  }

  payMentoredMonthly(byCreditCard = true) {
    if (!this.verifyAuth()) return;
    this.loadingMonthMentored = true;

    let payload: PaymentConfig = {
      ...this.payload,
      productType: 'MENTORED',
      mode: 'subscription',
      proPlan: true,
      recurringInterval: 'month',
    };

    if (!byCreditCard) {
      payload = {
        ...payload,
        currency: 'XAF',
        paymentEmail: this.authService?.currentUsr?.email,
      };
    }

    let popupWin = (window as any).open('about:blank', '_blank');

    this.payment.checkoutProPlanMonthly(payload).subscribe((data) => {
      this.loadingMonthMentored = false;
      popupWin.location.href = data;
      this.dialogRef.close();
    });
  }

  verifyAuth(): boolean {
    const currUser = this.authService.currentUsr as User;
    const loggedIn = !!currUser;

    if (!loggedIn) {
      this.router.navigate(['/login'], {
        relativeTo: this.route,
        queryParams: { redirectURL: this.router.url },
        queryParamsHandling: 'merge',
      });

      this.dialogRef.close();
      this.notify.openSnackBarInfo(
        'Veuillez vous connecter pour effectuer votre achat 🙂',
        'OK'
      );

      return false;
    }

    return true;
  }

  offresBasic = [
    {
      title: 'Unique',
      desc: 'Payez une seule fois et accédez au cours à vie',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA',
        },
        eur: {
          old: '5€',
          new: '4€',
        },
      },
      time: '/mois',
      pros: [],
      cons: [],
      subs: '',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss',
      },
      order: 1,
    },
    {
      title: '3 X',
      desc: 'Payez trois fois et accédez au cours à vie',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA',
        },
        eur: {
          old: '5€',
          new: '4€',
        },
      },
      time: '/mois',
      pros: [],
      cons: [],
      subs: '',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss',
      },
      order: 2,
    },
  ];

  offresMentore = [
    {
      title: 'Tous les mois',
      desc: 'En prenant un parcours mentoré',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA',
        },
        eur: {
          old: '5€',
          new: '4€',
        },
      },
      time: '/mois',
      pros: [
        "Vous avez l’assurance d'être suivi par un expert du domaine",
        'Vous bénéficiez de sessions hebdomadaires avec votre mentor personnel',
        'Vous réalisez et soutenez des projets en situation réelle',
        'Une attestation de formation vous est remise à la fin du parcours',
      ],
      cons: [],
      subs: '',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss',
      },
      order: 2,
    },
  ];

  ngOnInit(): void {
    this.payload = this.data.payload;
    this.type = this.data.type;
    this.course = this.data.course;
    this.country = this.geoLocationService.userLocation;

    this.priceCfa = this.course.price;
    this.priceEuro = this.course.price/100;
    this.currentPrice = {
      xaf: this.priceCfa,
      eur: this.priceEuro
    }
    this.currentPriceThreeTimes = {
      xaf: this.priceCfa/3,
      eur: this.priceEuro/3
    }
  }
}
