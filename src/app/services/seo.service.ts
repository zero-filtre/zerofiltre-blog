import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  readonly blogUrl = environment.blogUrl
  transparentHeader!: boolean;
  isFooterMounted = true;

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private translate: TranslateService
  ) { }

  generateTags({ 
    title = this.translate.instant('meta.homeTitle'),
    description = this.translate.instant('meta.homeDescription'),
    image = 'https://ik.imagekit.io/lfegvix1p/pro_vvcZRxQIU.png?updatedAt=1714202330763', 
    author = 'Zerofiltre.tech',
    publishDate = ''
  }) {

    this.title.setTitle(title);
    this.meta.updateTag({ property: 'description', content: description });
    this.meta.addTags([
      // Open Graph
      { property: 'og:url', content: `${this.blogUrl}${this.router.url}` },
      { name: 'title', property: 'og:title', content: title },
      { name: 'description', property: 'og:description', content: description },
      { name: 'image', property: 'og:image', content: image },
      { name: 'author', content: author },
      { name: 'publish_date', content: publishDate },
      // Twitter Card
      { name: 'twitter:image', content: image },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@zerofiltre.tech' },
      { name: 'twitter:creator', content: `@${author}` },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ]);
  }

  enanableTransparentHeader() {
    this.transparentHeader = true;
  }

  disableTransparentHeader() {
    this.transparentHeader = false;
  }

  mountFooter() {
    this.isFooterMounted = true;
  }

  unmountFooter() {
    this.isFooterMounted = false
  }
}
