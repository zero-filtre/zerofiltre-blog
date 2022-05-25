import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home-page2',
  templateUrl: './home-page2.component.html',
  styleUrls: ['./home-page2.component.css']
})
export class HomePage2Component implements OnInit {

  constructor(
    private seo: SeoService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.seo.generateTags({
      title: this.translate.instant('meta.homeTitle'),
      description: this.translate.instant('meta.homeDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });

    this.seo.enanableTransparentHeader();
  }

  ngOnDestroy(): void {
    this.seo.disableTransparentHeader();
  }

}
