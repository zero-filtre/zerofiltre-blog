import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-price-plan',
  templateUrl: './price-plan.component.html',
  styleUrls: ['./price-plan.component.css'],
})
export class PricePlanComponent {
  isCM = false;
  currencyCode: string;

  @Input() offre: any;
  @Input() price: { xaf: number; eur: number };
  @Input() loading: boolean;
  @Input() isBuy: boolean;
  @Input() isMentored: boolean;
  @Input() action: string;
  @Input() buyOption: number;
  @Input() country: string;
  @Input() payByMobileMoney = false;
  @Output() paymentEvent = new EventEmitter<any>();

  initPayment(cb = true) {
    this.paymentEvent.emit(cb);
  }

  ngOnInit(): void {
    if (this.country == 'CM') {
      this.isCM = true;
      this.currencyCode = 'XAF';
      // this.price = this.offre.price.cfa.new;
    } else {
      this.isCM = false;
      this.currencyCode = 'EUR';
      // this.price = this.offre.price.eur.new;
    }
  }
}
