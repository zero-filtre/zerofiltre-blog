import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, retryWhen, switchMap, throwError } from 'rxjs';
import { MessageService } from '../message.service';
import { genericRetryPolicy } from '../utilities.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/user/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoNetworkComponent } from 'src/app/articles/no-network/no-network.component';


@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  readonly apiServerUrl = environment.apiBaseUrl;

  dialogRef = null

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private authInterceptor: AuthInterceptor,
    public dialogNoNetworkRef: MatDialog,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.token;
    const userOrigin = this.authService?.currentUsr?.loginFrom;

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

            console.log(error);

            console.log(navigator.onLine);



            if (error.status === 0 && error.error instanceof ProgressEvent) {

              if (!this.dialogRef) {
                this.dialogRef = this.dialogNoNetworkRef.open(NoNetworkComponent, {
                  panelClass: 'delete-article-popup-panel',
                  disableClose: true,
                  autoFocus: true
                });

                this.dialogRef.afterClosed().pipe(
                  finalize(() => this.dialogRef = undefined)
                );
              }


              return throwError(() => errorMessage);
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
          this.authService.logout();
          return throwError(() => errordata)
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


    if (error.status === 0) {
      // Client side Error
      errorMessage = 'Une erreur est survenue. Veuillez essayer de nouveau ou contacter le support Zerofiltre (info@zerofiltre.tech)';
    } else {
      // Server side error
      let serverErrorExist = !!error?.error?.error;

      if (serverErrorExist) {
        errorMessage = error.error.error.message;
      }

      if (error.status === 401) {
        this.authService.logout();
        this.messageService.authError(this.router)
      }
    }

    return errorMessage;
  }
}

