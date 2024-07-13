import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-announcement-banner',
  templateUrl: './announcement-banner.component.html',
  styleUrls: ['./announcement-banner.component.css'],
})
export class AnnouncementBannerComponent {
  @Input() bannerText: string = 'This is an announcement!';
  @Input() bannerLink: string = '#';
  @Input() bannerActionBtn: string = 'Ici';
  @Input() isBannerVisible: boolean = false;

  closeBanner() {
    this.isBannerVisible = false;
  }
}
