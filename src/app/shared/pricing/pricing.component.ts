import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {

  offres = [
    {
      title: 'Gratuit à vie',
      price: null,
      time: null,
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
    {
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
      time: '/mois',
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
    {
      title: 'Illimité annuel (-20%)',
      price: {
        cfa: {
          old: '2000 FCFA',
          new: '1600 FCFA'
        },
        eur: {
          old: '5€',
          new: '4€'
        }
      },
      time: '/an',
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
  ]

}
