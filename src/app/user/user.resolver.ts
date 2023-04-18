import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { LoadEnvService } from '../services/load-env.service';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { NavigationService } from '../services/navigation.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {

  constructor(
    private loadEnvService: LoadEnvService,
    private authService: AuthService,
    private messageService: MessageService,
    private navigate: NavigationService,
    @Inject(PLATFORM_ID) private platformID: any
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    if (isPlatformBrowser(this.platformID)) {
      return this.authService
        .findUserProfile(route.params?.userID)
        .pipe(
          catchError(_ => {
            this.navigate.back();
            this.messageService.openSnackBarError("Oops ce profil n'existe pas 😣!", '');
            return EMPTY;
          })
        )
    }else {
      return EMPTY;
    }
  }
}
