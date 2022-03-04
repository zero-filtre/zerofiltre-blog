import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, mergeMap, Observable, switchMap, throwError } from 'rxjs';
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

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   const userOrigin = this.authService.currentUsr?.loginFrom;
  //   const authToken = this.authService.token;
  //   // if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 401 && userOrigin === null && authToken)

  //   if (this.jwtInterceptor.isAllowedDomain(request) && !this.jwtInterceptor.isDisallowedRoute(request)) {
  //     return next.handle(request)
  //       .pipe(
  //         catchError((err) => {
  //           const errorResponse = err as HttpErrorResponse;
  //           if (errorResponse.status === 401) {
  //             return this.authService.sendRefreshToken().pipe(mergeMap(() => {
  //               return this.authInterceptor.intercept(request, next);
  //             }));
  //           }
  //           return throwError(() => errorResponse);
  //         })
  //       );
  //   } else {
  //     return next.handle(request);
  //   }
  // }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /**
    * Add the token if exist to every request from the client to the api
    */

    const authToken = this.authService.token;
    const userOrigin = this.authService.currentUsr?.loginFrom;

    let authreq = request;

    authreq = this.AddTokenheader(request, authToken, userOrigin, next);

    return next.handle(authreq).pipe(
      catchError((errorResponse: HttpErrorResponse) => {

        // if (errorResponse.status === 401) {
        //   return this.handleRefrehToken(request, next, authToken, userOrigin)
        // }

        return throwError(() => errorResponse)
      })
    );
  }



  AddTokenheader(request: HttpRequest<unknown>, authToken: any, userOrigin: any, next: any) {
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

  handleRefrehToken(request: HttpRequest<unknown>, next: HttpHandler, authToken: any, userOrigin: any,) {
    return this.authService.refreshToken()
      .pipe(
        switchMap((data: any) => {
          // authservice.SaveTokens(data);
          return next.handle(this.AddTokenheader(request, authToken, userOrigin, next))
        }),
        catchError(errodata => {
          this.authService.logout();
          return throwError(() => errodata)
        })
      );
  }
}
