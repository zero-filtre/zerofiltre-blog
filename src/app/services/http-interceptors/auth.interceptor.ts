import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /**
    * Add the token if exist to every request from the client to the api
    */
    if (localStorage.getItem(this.authService.TOKEN_NAME)) {
      request = request.clone({
        headers: request.headers.set('authorization', `Bearer ${this.authService.token}`),
      });
    }
    return next.handle(request);
  }
}
