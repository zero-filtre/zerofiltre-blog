import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-ddd',
  templateUrl: './ddd.component.html',
  styleUrls: ['./ddd.component.css']
})
export class DddComponent implements OnInit, OnDestroy {
  public whySectionImage = 'https://ik.imagekit.io/lfegvix1p/inspiration__1__x-J3qi03A.svg';
  public learnSectionImage = 'https://ik.imagekit.io/lfegvix1p/Meza-3_a9TUXnmba.svg';
  public stepSectionImage = 'https://ik.imagekit.io/lfegvix1p/a_jWE-ysuJM.svg';
  public practiceSectionImage = 'https://ik.imagekit.io/lfegvix1p/Mesa-1_rxodYJjzE.svg';
  public masterSectionImage = 'https://ik.imagekit.io/lfegvix1p/inspiration_EkvzNOIP2U.svg';

  public lessonGroupImage1 = 'https://ik.imagekit.io/lfegvix1p/presentation_1_-REzJE-9c.svg';
  public lessonGroupImage2 = 'https://ik.imagekit.io/lfegvix1p/presentation_1_-REzJE-9c.svg';
  public lessonGroupImage3 = 'https://ik.imagekit.io/lfegvix1p/presentation_1_-REzJE-9c.svg';

  constructor(
    private loadEnvService: LoadEnvService,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    // this.seo.enanableTransparentHeader();
  }

  ngOnDestroy(): void {
    // this.seo.disableTransparentHeader();
  }
}
