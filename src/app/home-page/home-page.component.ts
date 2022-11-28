import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { LoadEnvService } from '../services/load-env.service';
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

  readonly servicesUrl = environment.servicesUrl
  readonly coursesUrl = environment.coursesUrl
  readonly activeCourseModule = environment.courseRoutesActive === 'true';

  public blogHeroImage = 'https://ik.imagekit.io/lfegvix1p/community1__PF0EdVIS.svg'
  public coursesHeroImage = 'https://ik.imagekit.io/lfegvix1p/Cours_pR5bDOPMu.svg'
  public servicesHeroImage = 'https://ik.imagekit.io/lfegvix1p/services_dsZIq509t.svg'

  constructor(
    private loadEnvService: LoadEnvService,
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
