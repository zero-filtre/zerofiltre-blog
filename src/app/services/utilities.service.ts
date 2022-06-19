import { Injectable } from '@angular/core';
import { Article } from '../articles/article.model';

import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, finalize, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor() { }
}

export function objectExists(obj: any): boolean {
  return !!obj;
}

export function calcReadingTime(article: Article): void {
  const content = article?.content;

  const wpm = 225;
  const words = content?.trim().split(/\s+/).length || 0;
  const time = Math.ceil(words / wpm);

  if (time === 0) {
    article.readingTime = 1;
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
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
}

export const genericRetryPolicy =
  ({
    maxRetryAttempts = 2,
    scalingDuration = 1000,
    excludedStatusCodes = [],
  }: iRetryPolicy = {}) =>
    (attempts: Observable<any>) => {
      return attempts.pipe(
        delay(scalingDuration), // Start retries after 2s from the initial req fail.
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          // if maximum number of retries have been met
          // or response is a status code we don't wish to retry, throw error
          if (
            retryAttempt > maxRetryAttempts ||
            excludedStatusCodes.find((e) => e === error.status)
          ) {
            return throwError(() => error);
          }

          // retry after 1s, 2s, 3s
          return timer(retryAttempt * scalingDuration);
        }),
        finalize(() => console.log('Retry end, We are done!'))
      );
    };

export function nFormatter(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'Md';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export function AddTargetToExternalLinks(): void {
  for (let anchors = document.querySelectorAll('a'), i = 0; i < anchors.length; i++) {
    let b = anchors[i];
    b.target = '_blank'
  }
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
};

export function getUrlLastElement(url: string): string {
  if (!url) return '';

  const urlArr = url.split('/')
  const last = urlArr.length - 1
  return urlArr[last];
}

export function getUrlHost(url: string): string {
  if (!url) return '';

  const urlArr = url.split('/')
  return urlArr[2]
}

export function capitalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}