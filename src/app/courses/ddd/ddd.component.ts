import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-ddd',
  templateUrl: './ddd.component.html',
  styleUrls: ['./ddd.component.css']
})
export class DddComponent implements OnInit, OnDestroy {
  public coursesHeroImage = 'https://ik.imagekit.io/lfegvix1p/course-workshop-2_MdBjzHzLo.jpg'

  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    // this.seo.enanableTransparentHeader();
  }

  ngOnDestroy(): void {
    // this.seo.disableTransparentHeader();
  }
}
