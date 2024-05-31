import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeoLocationService } from 'src/app/services/geolocaton.service';

@Component({
  selector: 'app-price-plan',
  templateUrl: './price-plan.component.html',
  styleUrls: ['./price-plan.component.css']
})
export class PricePlanComponent {
  isCM = false;
  price: string;

  @Input() offre: any;
  @Input() loading: boolean;
  @Input() isBuy: boolean;
  @Input() isMentored: boolean;
  @Input() action: string;
  @Input() buyOption: number;
  @Input() country: string; // TODO: Verifier Pourquoi cette valeur n'est pas correctement recue du composant parent
  @Output() paymentEvent = new EventEmitter<any>();

  constructor(
    private geoLocationService: GeoLocationService
  ) {}

  initPayment() {
    this.paymentEvent.emit();
  }


  // getLocation() {
  //   fetch('https://ipapi.co/json/')
  //     .then(response => response.json())
  //     .then(data => {
  //       if (['XAF','XOF'].includes(data.currency)) {
  //         this.locale = 'fr';
  //         this.isFR = true;
  //       }
  //       // Should run only in browser mode
  //       localStorage.setItem('_location', data.country_name)
  //     })
  // }


  ngOnInit(): void {
    this.geoLocationService.getUserLocation().subscribe({
      next: (data: any) => {
        this.country = data.country;
        // localStorage.setItem('_location', data.country_name)
        
        if(this.country=="CM"){
          this.isCM = true;
          this.price = this.offre.price.cfa.new;
        }
        else{
          this.isCM = false;
          this.price = this.offre.price.eur.new;
        }
      },
      error: (e) => {
        console.error('Erreur lors de la récupération de la localisation:', e);
      },
    });
  }

}
