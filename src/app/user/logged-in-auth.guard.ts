import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const isLoggegdIn = !!this.authService.token

    if (isLoggegdIn) {
      this.messageService.loggedInAuthError();
      return false
    } else {
      return true
    }
  }

}
