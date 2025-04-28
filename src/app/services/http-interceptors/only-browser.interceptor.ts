import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable()
export class OnlyBrowserInterceptor implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isPlatformBrowser(this.platformId)) {
      console.info('[CSR] RUN sur le navigateur, requête autorisée:', request.url);
      return next.handle(request);
    } else {
      console.warn('[SSR] RUN sur le server node, on ignore la requête HTTP:', request.url);
      return EMPTY;
    }
  }

}
