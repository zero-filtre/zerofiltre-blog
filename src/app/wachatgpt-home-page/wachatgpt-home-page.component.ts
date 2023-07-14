import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { BotUserPopupComponent } from '../shared/bot-user-popup/bot-user-popup.component';
import { BotService } from '../services/bot.service';
import { Router } from '@angular/router';

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
    private bot: BotService,
    private router: Router
  ) { }

  openAccountDialog() {
    if (this.bot.getToken() !== null && this.bot.validToken()) {
      this.router.navigateByUrl('wachatgpt/user');
      return;
    } else {
      this.bot.logout();
    }

    this.dialogEntryRef.open(BotUserPopupComponent, {
      panelClass: 'popup-panel',
      disableClose: true,
      data: {}
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
