import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class BotStatGuard implements CanActivate {

  constructor(
    private loadEnvService: LoadEnvService,
    private notify: MessageService,
    private bot: BotService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.bot.getToken() !== null && this.bot.validToken()) return true;
    
    this.bot.logout();
    this.router.navigateByUrl('wachatgpt');
    this.notify.showWarning(
      'Veuillez vous connecter en cliquant sur le boutton "Mon compte"',
      'OK'
    );

    return false;
  }
  
}
