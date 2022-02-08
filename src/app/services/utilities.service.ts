import { Injectable } from '@angular/core';
import { Article } from '../articles/article.model';

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
