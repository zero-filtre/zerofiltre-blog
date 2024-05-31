import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeoLocationService } from 'src/app/services/geolocaton.service';

@Component({
  selector: 'app-price-plan',
  templateUrl: './price-plan.component.html',
  styleUrls: ['./price-plan.component.css'],
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
  @Input() country: string;
  @Output() paymentEvent = new EventEmitter<any>();

  initPayment(cb = true) {
    this.paymentEvent.emit(cb);
  }

  ngOnInit(): void {
    if (this.country == 'CM') {
      this.isCM = true;
      this.price = this.offre.price.cfa.new;
    } else {
      this.isCM = false;
      this.price = this.offre.price.eur.new;
    }
  }
}
