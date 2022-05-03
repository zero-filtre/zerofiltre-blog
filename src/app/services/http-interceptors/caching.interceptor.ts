import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { RequestCacheService } from '../request-cache.service';

const TTL = 10;

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!isCacheable(req)) { return next.handle(req); }

    const cachedResponse = this.cache.get(req.url);
    console.log('REQ-URL: ', req.url);
    console.log('CACHED REQ: ', cachedResponse);

    return cachedResponse
      ? of(cachedResponse)
      : this.sendRequest(req, next);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req, event, TTL);
        }
      })
    );
  }
}

function isCacheable(req: HttpRequest<any>): boolean {
  if (req.method !== 'GET') return false
  return true
}