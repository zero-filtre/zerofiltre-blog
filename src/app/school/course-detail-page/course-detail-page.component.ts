import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-course-detail-page',
  templateUrl: './course-detail-page.component.html',
  styleUrls: ['./course-detail-page.component.css']
})
export class CourseDetailPageComponent implements OnInit {

  public whySectionImage = 'https://ik.imagekit.io/lfegvix1p/inspiration__1__x-J3qi03A.svg';
  public learnSectionImage = 'https://ik.imagekit.io/lfegvix1p/Meza-3_a9TUXnmba.svg';
  public stepSectionImage = 'https://ik.imagekit.io/lfegvix1p/a_jWE-ysuJM.svg';
  public practiceSectionImage = 'https://ik.imagekit.io/lfegvix1p/Mesa-1_rxodYJjzE.svg';
  public masterSectionImage = 'https://ik.imagekit.io/lfegvix1p/inspiration_EkvzNOIP2U.svg';

  public lessonGroupImage1 = 'https://ik.imagekit.io/lfegvix1p/presentation_1_-REzJE-9c.svg';
  public lessonGroupImage2 = 'https://ik.imagekit.io/lfegvix1p/presentation_1_-REzJE-9c.svg';
  public lessonGroupImage3 = 'https://ik.imagekit.io/lfegvix1p/presentation_1_-REzJE-9c.svg';

  course: any = {
    name: 'Apprenez le DDD',
    chapters: [
      {
        title: 'Titre du chapitre 1',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'video',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'doc',
            name: 'lesson numero 3',
            duration: '0:15',
            free: true
          },
        ]
      },
      {
        title: 'Titre du chapitre 2',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'doc',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'video',
            name: 'lesson numero 3',
            duration: '0:15',
            free: false
          },
        ]
      }
    ]
  }

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
  }

}
