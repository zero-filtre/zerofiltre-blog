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

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private authInterceptor: AuthInterceptor
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.token && this.authService.TOKEN_NAME === 'jwt_access_token') {
      return next.handle(request)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 401 && errorResponse.error.message === 'Expired JWT Token') {
              return this.authService.refreshToken().pipe(mergeMap(() => {
                return this.authInterceptor.intercept(request, next); // let the request continue it flow with the new valid token
              }));
            }

            return throwError(() => errorResponse);
          })
        );
    } else if (this.authService.token && (this.authService.TOKEN_NAME === 'gh_access_token' || this.authService.TOKEN_NAME === 'so_access_token')) {
      return next.handle(request)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 401) {
              return this.authService.refreshToken().pipe(mergeMap(() => {
                return this.authInterceptor.intercept(request, next); // let the request continue it flow with the new valid token
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
