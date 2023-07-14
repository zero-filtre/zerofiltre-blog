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
  nberOfMessages: number;
  weekDiffQty: number;
  weekDiffQtyAbs: number;
  isFirstWeek:boolean;

  constructor(
    private loadEnvService: LoadEnvService,
    private bot: BotService,
    private notify: MessageService,
    private router: Router,
  ) { }


  fetchUserStats(): void {
    this.loadingStats = true;

    const currentDayPos = new Date().getDay();
    let nberOfdays = currentDayPos + 6; // The nber of completed days of the current week + the nber of days of the previous week minus 1 (Api spec)
    if (currentDayPos == 0) nberOfdays = 7 + 6; // The sunday position is O, so we explicitely define its value to 7

    this.stats$ = this.bot.getUserStats(nberOfdays)
      .pipe(
        catchError(err => {
          this.loadingStats = false;
          this.notify.openSnackBarError('Une erreur est survenue lors de la récupération de vos statistiques', 'OK');
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

          currData = data.slice(data.length - currentDayPos);
          const currQty = this.sumValues(currData);

          if (data.length < 8) {
            this.isFirstWeek = true;
            this.nberOfMessages = currQty;

            return {
              prevWeek: [],
              currWeek: currData
            };
          }

          prevData = data.slice(0, 7);
          const prevQty = this.sumValues(prevData);

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
          this.notify.openSnackBarError('Une erreur est survenue lors de la récupération de vos informations', 'OK');
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
