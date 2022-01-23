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
