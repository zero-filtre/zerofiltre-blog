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

  generateTags({ title = '', description = '', image = '', author = '' }) {

    this.title.setTitle(title);
    this.meta.updateTag({ property: 'description', content: description });
    this.meta.addTags([
      // Open Graph
      { property: 'og:url', content: `${this.blogUrl}${this.router.url}` },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:author', content: author },
      { name: 'author', content: author },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:site_name', content: 'zerofiltre.tech' },
      // Twitter Card
      { name: 'twitter:image', content: image },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@zerofiltre.tech' },
      { name: 'twitter:author', content: `@${author}` },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ]);
  }
}
