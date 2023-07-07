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
  nberOfMessages: number;

  constructor(
    private loadEnvService: LoadEnvService,
    private router: Router,
    private bot: BotService,
    private notify: MessageService,
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
  
          this.loadingStats = false;
          this.nberOfMessages = arr.length;

          return arr;
        })
      )
  }


  ngOnInit(): void {
    this.fetchUserStats();
  }
}
