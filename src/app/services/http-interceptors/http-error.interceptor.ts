import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /**
     * Add the token if exist to every request from the client to the api
     * 
     * let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.authdata) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Basic ${currentUser.authdata}`
                }
            });
        }
     */

    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.setError(error)
          this.messageService.openSnackBarError(errorMessage, '')
          return throwError(() => errorMessage)
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

    if (error.error instanceof ErrorEvent) {
      // Client side Error
      errorMessage = error.error.message;
    } else {
      // Server side error
      if (error.status !== 0) {
        let serverErrorExist = !!error.error.error   // if assigned obj is null or undefined => return false else => return true
        if (serverErrorExist) {
          errorMessage = error.error.error.message;
        } else {
          errorMessage = errorMessage;
        }
      }
    }

    return errorMessage;
  }
}

