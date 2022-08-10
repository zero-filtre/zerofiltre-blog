import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private authService: AuthService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /**
    * Add the token if exist to every request from the client to the api
    */

    const authToken = this.authService.token;
    const userOrigin = this.authService?.currentUsr?.loginFrom;

    if (request.url.indexOf(this.apiServerUrl) === 0) {
      switch (userOrigin) {
        case null:
          request = request.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });
          break;
        case 'GITHUB':
          request = request.clone({ setHeaders: { Authorization: `token ${authToken}` } });
          break;
        case 'STACKOVERFLOW':
          request = request.clone({ setHeaders: { Authorization: `stack ${authToken}` } });
          break;
        default:
          return next.handle(request);
      }
    }

    return next.handle(request);
  }
}
