import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.authService.findUserProfile(route.params?.userID)
      .pipe(
        catchError(_ => {
          this.router.navigateByUrl('/articles');
          this.messageService.openSnackBarError('Oops ce profil est inexistant !', '');
          return EMPTY;
        })
      )
  }
}
