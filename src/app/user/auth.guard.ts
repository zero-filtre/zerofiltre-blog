import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: any
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
      return this.authService.isLoggedIn$
        .pipe(
          tap((isLoggedIn) => {
            if (!isLoggedIn) {
              this.messageService.authError(state);
            }
          })
        );
    }
    return true
  }

}
