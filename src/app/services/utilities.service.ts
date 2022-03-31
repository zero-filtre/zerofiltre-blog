import { Injectable } from '@angular/core';
import { Article } from '../articles/article.model';

import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, finalize, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor() { }
}

export function objectExists(obj: any): boolean {
  return !!obj;
}

export function calcReadingTime(article: Article): void {
  const content = article?.content

  const wpm = 225;
  const words = content?.trim().split(/\s+/).length || 0;
  const time = Math.ceil(words / wpm);

  if (time === 0) {
    article.readingTime = 1
  } else {
    article.readingTime = time;
  }
}

function join(t: any, a: any, s: any) {
  function format(m: any) {
    let f = new Intl.DateTimeFormat('en', m);
    return f.format(t);
  }
  return a.map(format).join(s);
}

export function formatDate(date: any) {
  const dateObj = new Date(date);
  const a = [{ day: 'numeric' }, { month: 'short' }, { year: 'numeric' }];
  return join(dateObj, a, ' ');
}

interface iRetryPolicy {
  maxRetryAttempts?: number,
  scalingDuration?: number,
  excludedStatusCodes?: number[]
}

export const genericRetryPolicy = ({
  maxRetryAttempts = 3,
  scalingDuration = 2000,
  excludedStatusCodes = []
}: iRetryPolicy = {}) => (attempts: Observable<any>) => {

  return attempts.pipe(
    delay(scalingDuration),  // Start retries after 2s from the initial req fail.
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return throwError(() => error);
      }

      // retry after 2s, 4s, 6s
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => console.log('Retry end, We are done!'))
  );
};
