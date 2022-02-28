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

    const authToken = this.authService.token;

    switch (this.authService.TOKEN_NAME) {
      case 'jwt_access_token':
        request = request.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });
        break;
      case 'gh_access_token':
        request = request.clone({ setHeaders: { Authorization: `token ${authToken}` } });
        break;
      case 'so_access_token':
        request = request.clone({ setHeaders: { Authorization: `stack ${authToken}` } });
        break;
      default:
        return next.handle(request);
    }

    return next.handle(request);
  }
}
