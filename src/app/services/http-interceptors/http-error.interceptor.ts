import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retryWhen, switchMap, throwError } from 'rxjs';
import { MessageService } from '../message.service';
import { genericRetryPolicy } from '../utilities.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/user/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private authInterceptor: AuthInterceptor
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.token;
    const userOrigin = this.authService.currentUsr?.loginFrom;

    if (request.url.indexOf(this.apiServerUrl) === 0) {
      return next.handle(request)
        .pipe(
          retryWhen(genericRetryPolicy({
            excludedStatusCodes: [400, 401, 403, 404, 500]
          })),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && authToken && userOrigin === null) {
              return this.handleRefrehToken(request, next);
            }

            const errorMessage = this.setError(error)
            this.messageService.openSnackBarError(errorMessage, '');
            return throwError(() => errorMessage);
          })
        );
    }

    return next.handle(request);
  }


  handleRefrehToken(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.authService.sendRefreshToken()
      .pipe(
        switchMap((_data: any) => {
          return this.authInterceptor.intercept(request, next);
        }),
        catchError(errordata => {
          localStorage.clear();
          this.router.navigate(['/login'], { queryParams: { 'redirectURL': this.router.url } });
          return throwError(() => errordata)
        })
      );
  }

  private clearLSwithout(itemValue: string) {
    for (var i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i)!;
      const value = localStorage[key];
      if (value !== itemValue) {
        localStorage.removeItem(value);
      }
    }
  }


  /***
   * Set error and check if Client side or Server side Error
   * When No response from the server or server is down => statusCode == 0 && statusText == 'Unknow Error' 
   * When No response from the server and database is down => statusCode == 500 && statusText == 'Internal Server Error' 
   * Ex: CORS block, Internet Failed
   */
  setError(error: HttpErrorResponse): string {
    let errorMessage = "Un problème est survenu, merci d'essayer de nouveau plus tard ou de contacter un administrateur de l'API";
    console.log('ERROR OCCURED: ', error);

    if (error.status === 0) {
      // Client side Error
      errorMessage = error.error.message;
    } else {
      // Server side error
      let serverErrorExist = !!error?.error?.error   // if the assigned obj is null or undefined => return false else => return true

      if (serverErrorExist) {
        errorMessage = error.error.error.message;
      } else {
        errorMessage = errorMessage;
      }

      if (error.status === 401) {
        localStorage.clear();
        this.router.navigate(['/login'], { queryParams: { 'redirectURL': this.router.url } });
      }
    }

    return errorMessage;
  }
}

