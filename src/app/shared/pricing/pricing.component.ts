import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  locale: string;
  isFR = false;

  offres = [
    {
      title: 'Découverte',
      desc: 'Meilleure option pour un usage découverte',
      price: {
        cfa: {
          old: '',
          new: 'Gratuit à vie'
        },
        eur: {
          old: '',
          new: 'Gratuit à vie'
        }
      },
      time: null,
      pros: ['5 Questions par jour'],
      cons: [
        'Questions vocales',
        'Sans annonces',
        'Support technique 7j/7',
        'Réduction'
      ],
      checkout: {
        cfa: 'https://wa.me/237693176973?text=Hello',
        eur: 'https://wa.me/237693176973?text=Hello'
      },
      order: 1
    },
    {
      title: 'Illimité mensuel',
      desc: 'Pertinent pour une utilisation quotidienne.',
      price: {
        cfa: {
          old: null,
          new: '2500 FCFA'
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
      cons: ['Réduction'],
      subs: 'Sans engagement: Annulez à tout moment',
      checkout: {
        cfa: 'https://buy.stripe.com/4gwaGefQEbQQ4ucaEH',
        eur: 'https://buy.stripe.com/28o15E0VK9II0dW4gh'
      },
      order: 2
    },
    {
      title: 'Illimité annuel (-20%)',
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
      order: 3
    }
  ]

  getLocation() {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        if (['XAF','XOF'].includes(data.currency)) {
          this.locale = 'fr';
          this.isFR = true;
        }
        // Should run only in browser mode
        localStorage.setItem('_location', data.country_name)
      })
  }

  ngOnInit(): void {
    this.getLocation();
  }

}
