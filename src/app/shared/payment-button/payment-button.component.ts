import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment-button',
  templateUrl: './payment-button.component.html',
  styleUrls: ['./payment-button.component.css']
})
export class PaymentButtonComponent {
  @Input() logo: string = '';
  @Input() bg: string = 'bg-blue-500';
  @Input() title: string = 'Pay Now';
  @Input() loading: boolean;
  @Output() clickAction = new EventEmitter<void>();

  onClick() {
    this.clickAction.emit();
  }
} 
