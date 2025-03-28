import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Course } from 'src/app/school/courses/course';
import { PaymentConfig } from 'src/app/school/studentCourse';
import { MessageService } from 'src/app/services/message.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';
import { GeoLocationService } from 'src/app/services/geolocaton.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-pro-page',
  templateUrl: './pro-page.component.html',
  styleUrls: ['./pro-page.component.css'],
})
export class ProPageComponent {
  payload: PaymentConfig;
  type: string;
  course: Course;
  loadingMonth: boolean;
  loadingYear: boolean;
  country: string;
  currentPriceMonth: { xaf: number; eur: number };
  currentPriceYear: { xaf: number; eur: number };

  constructor(
    private payment: PaymentService,
    private router: Router,
    private notify: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private seo: SeoService,
    private translate: TranslateService,
    private geoLocationService: GeoLocationService,
    private modalService: ModalService
  ) {}

  payProMonthly(byCreditCard = true) {
    if (!this.verifyAuth()) return;
    this.loadingMonth = true;

    let payload: PaymentConfig = {
      ...this.payload,
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

    this.payment.checkoutProPlanMonthly(payload).subscribe({
      next: (data) => {
        popupWin.location.href = data;
      },
      error: (e) => {
        console.log(e);
        this.loadingMonth = false;
      },
      complete: () => (this.loadingMonth = false),
    });
  }

  payProYearly(byCreditCard = true) {
    if (!this.verifyAuth()) return;
    this.loadingYear = true;

    let payload: PaymentConfig = {
      ...this.payload,
      recurringInterval: 'year',
    };

    if (!byCreditCard) {
      payload = {
        ...payload,
        currency: 'XAF',
        paymentEmail: this.authService?.currentUsr?.email,
      };
    }

    let popupWin = (window as any).open('about:blank', '_blank');

    this.payment.checkoutProPlanYearly(payload).subscribe({
      next: (data) => {
        popupWin.location.href = data;
      },
      error: (e) => {
        console.log(e);
        this.loadingYear = false;
      },
      complete: () => (this.loadingYear = false),
    });
  }

  verifyAuth(): boolean {
    const currUser = this.authService.currentUsr as User;
    const loggedIn = !!currUser;

    if (!loggedIn) {
      this.modalService.openLoginModal();
      this.notify.openSnackBarInfo(
        'Veuillez vous connecter pour effectuer votre achat 🙂',
        'OK', 5,'bottom', 'center'
      );
      
      return false;
    }

    return true;
  }

  offresPro = [
    {
      title: 'Mensuel',
      desc: 'Dépensez peu pour gagner gros',
      price: {
        cfa: {
          old: 2500,
          new: 6500,
        },
        eur: {
          old: 5,
          new: 9.99,
        },
      },
      time: '/mois',
      pros: [
        'Tous les cours 🌍',
        'Tous les articles y compris les articles premium 📖',
      ],
      cons: [],
      subs: 'Sans engagement: Annulez à tout moment',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss',
      },
      order: 1,
    },
    {
      title: 'Annuel',
      desc: 'Économisez en prenant un abonnement annuel',
      price: {
        cfa: {
          old: 2500,
          new: 72000,
        },
        eur: {
          old: 5,
          new: 109.89,
        },
      },
      time: '/mois',
      pros: [
        'Tous les cours 🌍',
        'Tous les articles y compris les articles premium 📖',
      ],
      cons: [],
      subs: 'Sans engagement: Annulez à tout moment',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss',
      },
      order: 2,
    },
  ];

  ngOnInit(): void {
    this.seo.generateTags({
      title: this.translate.instant('meta.proPageTitle'),
      description: this.translate.instant('meta.proPageDesc'),
      image:
        'https://ik.imagekit.io/lfegvix1p/pro_vvcZRxQIU.png?updatedAt=1714202330763',
      author: 'Zerofiltre.tech',
    });

    this.payload = {
      productId: 1,
      productType: 'COURSE',
      mode: 'subscription',
      proPlan: true,
    };

    this.country = this.geoLocationService.userLocation;
    // this.currentPriceMonth = this.country == 'CM' ? this.offresPro[0].price.cfa.new : this.offresPro[0].price.eur.new
    // this.currentPriceYear = this.country == 'CM' ? this.offresPro[1].price.cfa.new : this.offresPro[1].price.eur.new

    this.currentPriceMonth = {
      xaf: this.offresPro[0].price.cfa.new,
      eur: this.offresPro[0].price.eur.new,
    };
    this.currentPriceYear = {
      xaf: this.offresPro[1].price.cfa.new,
      eur: this.offresPro[1].price.eur.new,
    };
  }
}
