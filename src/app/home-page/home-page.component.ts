import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  public transformations = [{
    width: 1200,
    aspectRatio: "auto"
  }]

  public blogHeroImage = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png'
  public coursesHeroImage = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png'
  public servicesHeroImage = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png'

  constructor(
    private translate: TranslateService,
    private seo: SeoService
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
