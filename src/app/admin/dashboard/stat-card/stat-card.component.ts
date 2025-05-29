import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  // styleUrls: ['./stat-card.component.css'],
})
export class StatCardComponent {
  @Input() title: string;
  @Input() value: number;
  @Input() description: string;
  @Input() link: string;
  @Input() linkText: string;
  @Input() iconBgClass: string;
  @Input() icon: string;
}
