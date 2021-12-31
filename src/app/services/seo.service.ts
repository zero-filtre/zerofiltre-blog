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
      { property: 'og:url', content: `${this.blogUrl}${this.router.url}` },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:author', content: author },
      { name: 'author', content: author },
      { property: 'og:type', content: type },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:site_name', content: 'zerofiltre.tech' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@zerofiltre.tech' },
      { name: 'twitter:creator', content: `@${author}` },
      { name: 'twitter:author', content: `@${author}` },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ]);
  }
}
