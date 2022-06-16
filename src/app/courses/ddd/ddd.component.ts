import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-ddd',
  templateUrl: './ddd.component.html',
  styleUrls: ['./ddd.component.css']
})
export class DddComponent implements OnInit, OnDestroy {
  // public whySectionImage = 'https://ik.imagekit.io/lfegvix1p/domain-bgg-off_rKGMAzNWa.png';
  public whySectionImage = 'https://ik.imagekit.io/lfegvix1p/inspiration__1__x-J3qi03A.svg';
  public learnSectionImage = 'https://ik.imagekit.io/lfegvix1p/Meza-3_a9TUXnmba.svg';
  public stepSectionImage = 'https://ik.imagekit.io/lfegvix1p/a_jWE-ysuJM.svg';
  public practiceSectionImage = 'https://ik.imagekit.io/lfegvix1p/Mesa-1_rxodYJjzE.svg';
  public masterSectionImage = 'https://ik.imagekit.io/lfegvix1p/inspiration__1__x-J3qi03A.svg';

  public lessonGroupImage1 = 'https://ik.imagekit.io/lfegvix1p/ddd-icon-bg-off_uYBd7RKWP.png';
  public lessonGroupImage2 = 'https://ik.imagekit.io/lfegvix1p/ddd-icon-bg-off_uYBd7RKWP.png';
  public lessonGroupImage3 = 'https://ik.imagekit.io/lfegvix1p/ddd-icon-bg-off_uYBd7RKWP.png';

  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    // this.seo.enanableTransparentHeader();
  }

  ngOnDestroy(): void {
    // this.seo.disableTransparentHeader();
  }
}
