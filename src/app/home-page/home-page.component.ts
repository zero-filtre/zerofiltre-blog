import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public transformations = [{
    width: 1200,
    aspectRatio: "auto"
  }]

  public blogHeroImage = 'https://ik.imagekit.io/lfegvix1p/blog-post_Fqr6Kp8fF.jpg?'
  public coursesHeroImage = 'https://ik.imagekit.io/lfegvix1p/course-workshop-2_MdBjzHzLo.jpg'
  public servicesHeroImage = 'https://ik.imagekit.io/lfegvix1p/our-services_4MZFz7DlJ.jpg'

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
  }

}
