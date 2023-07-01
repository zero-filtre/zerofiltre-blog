import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { BotUserPopupComponent } from '../shared/bot-user-popup/bot-user-popup.component';

@Component({
  selector: 'app-wachatgpt-home-page',
  templateUrl: './wachatgpt-home-page.component.html',
  styleUrls: ['./wachatgpt-home-page.component.css']
})
export class WachatgptHomePageComponent implements OnInit {

  constructor(
    private seo: SeoService,
    public translate: TranslateService,
    public dialogEntryRef: MatDialog,
  ) { }

  openAccountDialog() {
    this.dialogEntryRef.open(BotUserPopupComponent, {
      panelClass: 'popup-panel',
      data: {
        // router: this.router
      }
    });
  }

  ngOnInit(): void {
    this.seo.generateTags({
      title: this.translate.instant('wachatgpt.title'),
      description: this.translate.instant('wachatgpt.description'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

}
