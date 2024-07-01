import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css']
})
export class WhatsappButtonComponent {
  mobileQuery: MediaQueryList;
  message = "Bonjour, j'ai besoin de me faire former."
  desktopLink = `https://web.whatsapp.com/send/?phone=33753428623&text=${this.message}`
  mobileLink = `https://wa.me/33753428623?text=${this.message}`

  constructor(
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ){
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;
}
