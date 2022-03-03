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
    private authInterceptor: AuthInterceptor,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const userOrigin = this.authService.currentUsr?.loginFrom;

    return next.handle(request)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 401 && userOrigin === null) {
            return this.authService.sendRefreshToken().pipe(mergeMap(() => {
              return this.authInterceptor.intercept(request, next);
            }));
          }

          return throwError(() => errorResponse);
        })
      );
  }
}
