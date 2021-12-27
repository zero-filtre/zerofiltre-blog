import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  readonly blogUrl = environment.blogUrl

  constructor(private title: Title, private meta: Meta, private router: Router) { }

  generateTags({ title = '', description = '', image = '', author = '', type = '' }) {

    this.title.setTitle(title);
    this.meta.addTags([
      // Open Graph
      { name: 'og:url', content: `${this.blogUrl}${this.router.url}` },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: image },
      { name: 'og:author', content: author },
      { name: 'og:type', content: type },
      { name: 'og:locale', content: 'fr_FR' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@zerofiltre.tech' },
      { name: 'twitter:creator', content: `@${author}` },
      { name: 'twitter:author', content: `@${author}` },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ]);
  }
}
