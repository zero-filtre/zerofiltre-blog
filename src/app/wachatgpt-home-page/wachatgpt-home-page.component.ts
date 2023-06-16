import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wachatgpt-home-page',
  templateUrl: './wachatgpt-home-page.component.html',
  styleUrls: ['./wachatgpt-home-page.component.css']
})
export class WachatgptHomePageComponent implements OnInit {

  constructor(
    private seo: SeoService,
    public translate: TranslateService
  ) { }

  offres = {
    gratuit: {
      title: 'Gratuit à vie',
      price: null,
      pros: ['5 Questions par jour'],
      cons: [
        'Questions vocales',
        'Sans annonces',
        'Support technique 7j/7'
      ],
      checkout: {
        cfa: 'https://wa.me/237620158556?text=Hello',
        eur: 'https://wa.me/237620158556?text=Hello'
      }
    },
    mensuel: {
      title: 'Illimité mensuel',
      price: {
        cfa: {
          old: null,
          new: '2600 FCFA'
        },
        eur: {
          old: null,
          new: '5€'
        }
      },
      pros: [
        'Questions illimitées',
        'Questions vocales',
        'Sans annonces',
        'Support technique 7j/7',
      ],
      cons: [],
      subs: 'Sans engagement: Annulez à tout moment',
      checkout: {
        cfa: 'https://buy.stripe.com/dR6cMVgzG6ubfbGeUY',
        eur: 'https://buy.stripe.com/cN28wFdnug4L1kQ28d'
      }
    },
    annuel: {
      title: 'Illimité annuel (-20%)',
      price: {
        cfa: {
          old: '2000 FCFA',
          new: '1600 FCFA'
        },
        eur: {
          old: '4€',
          new: '5€'
        }
      },
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
        cfa: 'https://buy.stripe.com/eVa6oxgzG7yfe7C9AH',
        eur: 'https://buy.stripe.com/eVa14ddnu8Cj6Fa8wC'
      }
    }
  }

  ngOnInit(): void {
    this.seo.generateTags({
      title: this.translate.instant('wachatgpt.title'),
      description: this.translate.instant('wachatgpt.description'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

}
