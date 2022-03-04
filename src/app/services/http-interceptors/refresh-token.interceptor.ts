import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { JwtInterceptor } from '@auth0/angular-jwt';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private authInterceptor: AuthInterceptor,
    private jwtInterceptor: JwtInterceptor
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const userOrigin = this.authService.currentUsr?.loginFrom;
    const authToken = this.authService.token;
    // if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 401 && userOrigin === null && authToken)

    if (this.jwtInterceptor.isAllowedDomain(request) && !this.jwtInterceptor.isDisallowedRoute(request)) {
      return next.handle(request)
        .pipe(
          catchError((err) => {
            const errorResponse = err as HttpErrorResponse;
            if (errorResponse.status === 401) {
              return this.authService.sendRefreshToken().pipe(mergeMap(() => {
                return this.authInterceptor.intercept(request, next);
              }));
            }
            return throwError(() => errorResponse);
          })
        );
    } else {
      return next.handle(request);
    }
  }
}
