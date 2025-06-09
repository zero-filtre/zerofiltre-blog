import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadEnvService } from '../../services/load-env.service';
import { AuthService } from '../../user/auth.service';
import { MessageService } from '../../services/message.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenExpiredGuard implements CanActivate {
  constructor(
    private loadEnvService: LoadEnvService,
    private authService: AuthService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (isPlatformBrowser(this.platformId)) {
      this.checkToken();
    }
    return true
  }

  checkToken() {
    const authToken = this.authService.token;
    const userOrigin = this.authService?.currentUsr?.loginFrom;

    const refreshTokenExpiresIn = +this.authService.refreshTokenExpiryDate;
    const todayTime = Math.floor(new Date().getTime() / 1000.0);

    if (authToken && userOrigin === null) {
      if (todayTime > refreshTokenExpiresIn) {
        this.authService.logout();
        this.messageService.showError(
          'Votre session est expirée ! Veuillez vous reconnecter.',
          'OK'
        );
      }
    }
  }
}
