import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-price-plan',
  templateUrl: './price-plan.component.html',
  styleUrls: ['./price-plan.component.css']
})
export class PricePlanComponent {
  locale: string;
  isFR = false;

  @Input() offre: any;
  @Input() loading: boolean;
  @Input() isBuy: boolean;
  @Input() isMentored: boolean;
  @Input() price: number;
  @Input() action: string;
  @Input() buyOption: number;
  @Output() paymentEvent = new EventEmitter<any>();

  initPayment() {
    this.paymentEvent.emit();
  }

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
    // this.getLocation();
  }
}
