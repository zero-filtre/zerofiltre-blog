import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoadEnvService } from '../services/load-env.service';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private loadEnvService: LoadEnvService,
    private authService: AuthService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private translate: TranslateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if (isPlatformBrowser(this.platformId)) {
      const user = this.authService?.currentUsr;
      const isLoggedIn = !!user;

      if (!isLoggedIn) {
        const msg = this.translate.instant('login.authErrorMessage')
        this.messageService.authError(msg);

        this.router.navigate(['/login'], {
          // relativeTo: state,
          queryParams: { redirectURL: state.url },
          queryParamsHandling: 'merge',
        });
      }

      return isLoggedIn;
    }

    return true;
  }
}
