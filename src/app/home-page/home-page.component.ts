import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { LoadEnvService } from '../services/load-env.service';
import { SeoService } from '../services/seo.service';
import { SurveyService } from '../services/survey.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  readonly blogUrl = environment.blogUrl;

  prod = this.blogUrl.startsWith('https://dev.') ? false : true;

  public blogHeroImage = 'https://ik.imagekit.io/lfegvix1p/community1__PF0EdVIS.svg'
  public coursesHeroImage = 'https://ik.imagekit.io/lfegvix1p/Cours_pR5bDOPMu.svg'
  public servicesHeroImage = 'https://ik.imagekit.io/lfegvix1p/services_dsZIq509t.svg'

  reviews: any[]

  constructor(
    private loadEnvService: LoadEnvService,
    private translate: TranslateService,
    private seo: SeoService,
    private reviewService: SurveyService
  ) { }

  fetchReviews() {
    this.reviewService.getReviews()
      .subscribe({
        next: (data: any) => {
          this.reviews = data
        },
        error: (e: HttpErrorResponse) => console.log(e)
      })
  }

  ngOnInit(): void {
    this.seo.generateTags({
      title: this.translate.instant('meta.homeTitle'),
      description: this.translate.instant('meta.homeDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://ik.imagekit.io/lfegvix1p/pro_vvcZRxQIU.png?updatedAt=1714202330763'
    });

    this.seo.enanableTransparentHeader();
  }

  ngOnDestroy(): void {
    this.seo.disableTransparentHeader();
  }

}
