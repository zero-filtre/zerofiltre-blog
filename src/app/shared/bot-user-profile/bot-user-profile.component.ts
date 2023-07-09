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
  stats$: Observable<any>;
  infos$: Observable<any[]>;
  weekDiffQty: number;
  weekDiffQtyAbs: number;

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
          let data = [];
          let prevData = [];
          let currData = [];
  
          this.loadingStats = false;

          for (let key in messageCountByDay) {
            data = [...data, { [key]: messageCountByDay[key] }]
          }
          
          data.sort((a, b) => {
            const keyA = Object.keys(a)[0];
            const keyB = Object.keys(b)[0];
            return new Date(keyA).getTime() - new Date(keyB).getTime();
          });

          currData = data.slice(data.length - 7);
          prevData = data.slice(0, 7);

          const prevQty = this.sumValues(prevData);
          const currQty = this.sumValues(currData);

          this.weekDiffQty = currQty - prevQty;
          this.weekDiffQtyAbs = Math.abs(currQty - prevQty);

          return { 
            prevWeek: prevData,
            currWeek: currData
          };
        }),
        shareReplay()
      )
  }

  sumValues(data: any) {
    return data.reduce((acc, obj) => {
      const value = Object.values(obj)[0];
      return acc + value;
    }, 0);
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
