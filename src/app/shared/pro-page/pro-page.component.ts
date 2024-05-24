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


@Component({
  selector: 'app-pro-page',
  templateUrl: './pro-page.component.html',
  styleUrls: ['./pro-page.component.css']
})
export class ProPageComponent {

  payload: PaymentConfig = { productId: 1, productType: 'COURSE', mode: 'subscription', proPlan: true, paymentEmail: "philippechampion58@gmail.com", currency:"EUR" }
  type: string;
  course: Course;
  loadingMonth: boolean
  loadingYear: boolean
  country: string;

  constructor(
    private payment: PaymentService,
    private router: Router,
    private notify: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private seo: SeoService,
    private translate: TranslateService,
    private geoLocationService: GeoLocationService
  ) { }

  payProMonthly() {
    if (!this.verifyAuth()) return;

    this.loadingMonth = true;
    this.payload = { ...this.payload, recurringInterval: 'month', currency: this.country == "CM" ? "XAF" : "EUR" }

    let popupWin = (window as any).open('about:blank', "_blank");

    this.payment.checkoutProPlanMonthly(this.payload)
      .subscribe(data => {
        this.loadingMonth = false;
        popupWin.location.href = data;
      })
  }

  payProYearly() {
    if (!this.verifyAuth()) return;

    this.loadingYear = true;
    this.payload = { ...this.payload, recurringInterval: 'year' }

    let popupWin = (window as any).open('about:blank', "_blank");

    this.payment.checkoutProPlanYearly(this.payload)
      .subscribe(data => {
        this.loadingYear = false;
        popupWin.location.href = data;
      })
  }


  verifyAuth(): boolean {
    const currUser = this.authService.currentUsr as User;
    const loggedIn = !!currUser;

    if (!loggedIn) {
      this.router.navigate(
        ['/login'],
        {
          relativeTo: this.route,
          queryParams: { redirectURL: this.router.url },
          queryParamsHandling: 'merge',
        });

      this.notify.openSnackBarInfo('Veuillez vous connecter pour effectuer votre achat 🙂', 'OK');

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
          old: '2500 FCFA',
          new: '6500 FCFA'
        },
        eur: {
          old: '5€',
          new: '9,99€'
        }
      },
      time: '/mois',
      pros: [
        'Tous les cours hors parcours mentorés 🌍',
        'Tous les articles y compris les articles premium 📖'
      ],
      cons: [],
      subs: 'Sans engagement: Annulez à tout moment',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss'
      },
      order: 1
    },
    {
      title: 'Annuel',
      desc: 'Économisez en prenant un abonnement annuel',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '73000 FCFA'
        },
        eur: {
          old: '5€',
          new: '109,89 €'
        }
      },
      time: '/mois',
      pros: [
        'Tous les cours hors parcours mentorés 🌍',
        'Tous les articles y compris les articles premium 📖'
      ],
      cons: [],
      subs: 'Sans engagement: Annulez à tout moment',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss'
      },
      order: 2
    }
  ]

  ngOnInit(): void {
    this.seo.generateTags({
      title: this.translate.instant('meta.proPageTitle'),
      description: this.translate.instant('meta.proPageDesc'),
      image: 'https://ik.imagekit.io/lfegvix1p/pro_vvcZRxQIU.png?updatedAt=1714202330763',
      author: 'Zerofiltre.tech'
    });

    this.country = 'CM';

    // this.geoLocationService.getUserLocation().subscribe(
    //   data => {
    //     this.country = data.country;
    //   },
    //   error => {
    //     console.error('Erreur lors de la récupération de la localisation:', error);
    //   }
    // );
  }
}
