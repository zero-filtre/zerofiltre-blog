import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  private _icon: string;
  public safeIcon: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  @Input()
  set icon(value: string) {
    this._icon = value;
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(value);
  }

  get icon(): string {
    return this._icon;
  }
}
