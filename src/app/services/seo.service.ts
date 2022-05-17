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
      { name: 'title', property: 'og:title', content: title },
      { name: 'description', property: 'og:description', content: description },
      { name: 'image', property: 'og:image', content: image },
      { name: 'author', content: author },
      // Twitter Card
      { name: 'twitter:image', content: image },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@zerofiltre.tech' },
      { name: 'twitter:creator', content: `@${author}` },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ]);
  }
}
