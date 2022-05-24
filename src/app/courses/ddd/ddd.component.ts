import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-ddd',
  templateUrl: './ddd.component.html',
  styleUrls: ['./ddd.component.css']
})
export class DddComponent implements OnInit, OnDestroy {
  public whySectionImage = 'https://ik.imagekit.io/lfegvix1p/domain-bgg-off_rKGMAzNWa.png';
  public learnSectionImage = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png';
  public stepSectionImage = 'https://ik.imagekit.io/lfegvix1p/step-bg-off_tsTm1s3al.png';
  public practiceSectionImage = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png';
  public masterSectionImage = 'https://ik.imagekit.io/lfegvix1p/image3_ynuh5_peV.svg';

  public lessonGroupImage1 = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png';
  public lessonGroupImage2 = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png';
  public lessonGroupImage3 = 'https://ik.imagekit.io/lfegvix1p/course-bg-off_r4Pa4_TT_.png';

  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    // this.seo.enanableTransparentHeader();
  }

  ngOnDestroy(): void {
    // this.seo.disableTransparentHeader();
  }
}
