import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retryWhen, throwError } from 'rxjs';
import { MessageService } from '../message.service';
import { genericRetryPolicy } from '../utilities.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        retryWhen(genericRetryPolicy({
          excludedStatusCodes: [400, 401, 403, 404, 500]
        })),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.setError(error)
          this.messageService.openSnackBarError(errorMessage, '');
          return throwError(() => errorMessage);
        })
      );
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

    if (error.error instanceof ErrorEvent) {
      // Client side Error
      errorMessage = error.error.message;
    } else {
      // Server side error
      if (error.status !== 0) {
        let serverErrorExist = !!error?.error?.error   // if the assigned obj is null or undefined => return false else => return true

        if (serverErrorExist) {
          errorMessage = error.error.error.message;
        } else {
          errorMessage = errorMessage;
        }

        if (error.status === 401) {
          this.authService.sendRefreshToken();
          // localStorage.clear();
          // this.router.navigate(['/login'], { queryParams: { 'redirectURL': this.router.url } });
        }
      }
    }

    return errorMessage;
  }
}

