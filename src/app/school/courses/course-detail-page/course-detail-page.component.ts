import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Observable, switchMap, catchError, tap, throwError, BehaviorSubject, map, shareReplay, EMPTY } from 'rxjs';
import { Course, Reaction } from '../course';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';
import { ChapterService } from '../../chapters/chapter.service';
import { AuthService } from '../../../user/auth.service';
import { User } from '../../../user/user.model';
import { environment } from 'src/environments/environment';
import { CourseEnrollment } from '../../studentCourse';
import { PaymentService } from 'src/app/services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentPopupComponent } from 'src/app/shared/payment-popup/payment-popup.component';

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

  courseEnrollment$: Observable<CourseEnrollment>;
  isSubscriber: boolean;
  isLoading: boolean;


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

    this.course$ = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.courseID = params.get('course_id');

          this.chapters$ = this.chapterService
            .fetchAllChapters(this.courseID);
          
          return this.getCourse();
        })
      );

    this.courseEnrollment$ = this.route.data
      .pipe(
        map(({ sub }) => {
          if (sub === true) return;
          
          this.isSubscriber = !!sub;
          return sub
        })
      )

  }

}
