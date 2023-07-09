import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bot-user-profile',
  templateUrl: './bot-user-profile.component.html',
  styleUrls: ['./bot-user-profile.component.css']
})
export class BotUserProfileComponent {
  loadingStats: boolean;
  loadingInfos: boolean;
  stats$: Observable<any[]>;
  infos$: Observable<any[]>;
  nberOfMessages: number;

  constructor(
    private loadEnvService: LoadEnvService,
    private bot: BotService,
    private notify: MessageService,
    private router: Router,
  ) { }


  fetchUserStats(): void {
    this.loadingStats = true;

    this.stats$ = this.bot.getUserStats()
      .pipe(
        catchError(err => {
          this.loadingStats = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),
        map(({ messageCountByDay }) => {
          let arr = [];
  
          for (let key in messageCountByDay) {
            arr = arr.concat(messageCountByDay[key])
          }
          
          arr = arr.slice(arr.length - 7);
          this.loadingStats = false;
          this.nberOfMessages = arr.reduce((curr, sum) => sum + curr, 0)

          return arr;
        }),
        shareReplay()
      )
  }

  fetchUserInfos(): void {
    this.loadingInfos = true;

    this.infos$ = this.bot.getUser()
      .pipe(
        catchError(err => {
          this.loadingInfos = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),
        map(data => {
          this.loadingInfos = false;
          return data;
        })
      )
  }

  logout() {
    this.bot.logout();
    this.router.navigateByUrl('wachatgpt');
  }


  ngOnInit(): void {
    this.fetchUserStats();
    this.fetchUserInfos();
  }
}
