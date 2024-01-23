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
  loadingMonthMentored: boolean

  constructor(
    private payment: PaymentService,
    public dialogRef: MatDialogRef<PaymentPopupComponent>,
    private router: Router,
    private notify: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute,
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

  payMentoredMonthly() {
    // if (!this.verifyAuth()) return;

    this.loadingMonthMentored = true;
    this.payload = { ...this.payload, productType: 'MENTORED', mode: 'subscription', proPlan: true, recurringInterval: 'month' }

    let popupWin = (window as any).open('about:blank', "_blank");

    this.payment.checkoutProPlanMonthly(this.payload)
      .subscribe(data => {
        this.loadingMonthMentored = false;
        popupWin.location.href = data;
        this.dialogRef.close();
      })
  }

  // verifyAuth(): boolean {
  //   const currUser = this.authService.currentUsr as User;
  //   const loggedIn = !!currUser;

  //   if (!loggedIn) {
  //     this.router.navigate(
  //       ['/login'],
  //       {
  //         relativeTo: this.route,
  //         queryParams: { redirectURL: this.router.url },
  //         // queryParamsHandling: 'merge',
  //       });

  //     this.dialogRef.close();
  //     this.notify.openSnackBarInfo('Veuillez vous connecter pour acheter ce cours 🙂', 'OK');

  //     return false;
  //   }

  //   return true;
  // }


  offresPro = [
    {
      title: 'Mensuel',
      desc: 'Idéal pour les utilisations à grande échelle',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA'
        },
        eur: {
          old: '5€',
          new: '4€'
        }
      },
      time: '/mois',
      pros: [
        'Questions illimitées',
        'Questions vocales',
        'Sans annonces',
        'Support technique 7j/7',
        '20% de réduction'
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
      desc: 'Idéal pour les utilisations à grande échelle',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA'
        },
        eur: {
          old: '5€',
          new: '4€'
        }
      },
      time: '/mois',
      pros: [
        'Questions illimitées',
        'Questions vocales',
        'Sans annonces',
        'Support technique 7j/7',
        '20% de réduction'
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

  offresBasic = [
    {
      title: '1 Fois',
      desc: 'Idéal pour les utilisations à grande échelle',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA'
        },
        eur: {
          old: '5€',
          new: '4€'
        }
      },
      time: '/mois',
      pros: [
        'Questions illimitées',
        'Questions vocales',
        'Sans annonces',
        'Support technique 7j/7',
        '20% de réduction'
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
      title: '3 Fois',
      desc: 'Idéal pour les utilisations à grande échelle',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA'
        },
        eur: {
          old: '5€',
          new: '4€'
        }
      },
      time: '/mois',
      pros: [
        'Questions illimitées',
        'Questions vocales',
        'Sans annonces',
        'Support technique 7j/7',
        '20% de réduction'
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

  offresMentore = [
    {
      title: 'Tous les mois',
      desc: 'En achetant un parcours mentoré',
      price: {
        cfa: {
          old: '2500 FCFA',
          new: '2000 FCFA'
        },
        eur: {
          old: '5€',
          new: '4€'
        }
      },
      time: '/mois',
      pros: [
        "Vous avez l’assurance d'être suivi par un expert du domaine",
        "Vous bénéficiez de sessions hebdomadaires avec votre mentor personnel",
        "Vous réalisez et soutenez des projets en situation réelle",
        "Une attestation de formation vous est remise à la fin du parcours"
      ],
      cons: [],
      subs: '',
      checkout: {
        cfa: 'https://buy.stripe.com/dR64hQ1ZO1ccgcU3ce',
        eur: 'https://buy.stripe.com/5kAeWu5c01ccbWE7ss'
      },
      order: 2
    },
  ]



  ngOnInit(): void {
    this.payload = this.data.payload;
    this.type = this.data.type;
    this.course = this.data.course;
    console.log('COURSE: ', this.course.mentored);
  }

}
