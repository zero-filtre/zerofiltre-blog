import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Observable, switchMap, catchError, tap, throwError, BehaviorSubject, map, shareReplay } from 'rxjs';
import { Course, Reaction, Review, Section } from '../course';
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
import { MediaMatcher } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { JsonLdService } from 'ngx-seo';
import { JsonLd } from 'ngx-seo/lib/json-ld';
import { SlugUrlPipe } from 'src/app/shared/pipes/slug-url.pipe';
import { Location } from '@angular/common';
import { SurveyService } from 'src/app/services/survey.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';

@Component({
  selector: 'app-course-detail-page',
  templateUrl: './course-detail-page.component.html',
  styleUrls: ['./course-detail-page.component.css'],
})
export class CourseDetailPageComponent implements OnInit {
  STRIPE_PUBLIC_KEY = environment.stripePublicKey;

  courseID: string;
  course$: Observable<Course>;
  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;
  course: Course;

  courseEnrollment$: Observable<CourseEnrollment>;
  isSubscriber: boolean;
  isLoading: boolean;
  isCheckingEnrollment: boolean;

  currentVideoId: string;
  orderedSections: Section[];
  mobileQuery: MediaQueryList;
  // paymentHandler: any = null;

  public loading!: boolean;
  private isPublished = new BehaviorSubject<any>(null);
  public isPublished$ = this.isPublished.asObservable();

  private nberOfReactions = new BehaviorSubject<number>(0);
  public nberOfReactions$ = this.nberOfReactions.asObservable();

  constructor(
    private seo: SeoService,
    private jsonLd: JsonLdService,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private chapterService: ChapterService,
    private notify: MessageService,
    private navigate: NavigationService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private surveyService: SurveyService,
    public dialogPaymentRef: MatDialog,
    public slugify: SlugUrlPipe,
    private location: Location,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private enrollmentService: EnrollmentService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  get canAccessCourse() {
    const user = this.authService?.currentUsr as User;
    return this.courseService.canAccessCourse(user, this.course);
  }

  get canEditCourse() {
    const user = this.authService?.currentUsr as User;
    return this.courseService.canEditCourse(user, this.course);
  }

  buyCourse() {
    const payload = { productId: +this.courseID, productType: 'COURSE' };
    const type = 'basic';

    this.paymentService.openPaymentDialog(payload, type, this.course);
  }

  getCourse(courseId: string) {
    this.isLoading = true;

    this.courseService
      .findCourseById(courseId)
      .pipe(
        tap((data) => {
          if (data.status === 'PUBLISHED') {
            this.isPublished.next(true);
          } else {
            this.isPublished.next(false);
          }
        })
      )
      .subscribe({
        next: (data: Course) => {
          const rootUrl = this.router.url.split('/')[1];
          const sluggedUrl = `${rootUrl}/${this.slugify.transform(data)}`;
          this.location.replaceState(sluggedUrl);

          this.seo.generateTags({
            title: data.title,
            description: data.summary,
            image: data.thumbnail,
            author: data.author?.fullName,
            publishDate: data.publishedAt?.substring(0, 10),
          });

          const dataSchema = {
            '@context': 'https://schema.org',
            '@type': 'Course',
            author: {
              '@type': 'Person',
              name: data.author.fullName,
            },
            name: data.title,
            description: data.summary,
            image: data.thumbnail,
            datePublished: data.publishedAt?.substring(0, 10),
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
              CourseWorkload: 'PT5H',
            },
            offers: {
              '@type': 'Offer',
              category: 'Intermediaire',
              price: data.price.toString(),
              priceCurrency: 'EUR',
            },
            provider: {
              '@type': 'Organization',
              name: 'Zerofiltre',
              sameAs: 'https://www.zerofiltre.tech',
            },
          } as JsonLd | any;

          this.jsonLd.setData(dataSchema);

          this.isLoading = false;
          this.isSubscriber = this.courseService.isSubscriber(data.id);

          this.course = data;
          this.orderSections(data);
          this.extractVideoId(data.video);

          return this.course;
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;

          if (err.status === 404) {
            this.notify.openSnackBarError(
              "Oops ce cours est n'existe pas 😣!",
              ''
            );
            this.navigate.back();
          }
          return throwError(() => err?.message);
        },
        complete: () => {
          this.isLoading = false;
          return this.course;
        },
      });
  }

  orderSections(course: Course) {
    const list = course.sections;
    this.orderedSections = list.sort(
      (a: Section, b: Section) => a.position - b.position
    );
  }

  isValidURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  extractVideoId(videoLink: string) {
    if (!videoLink) return;
    if (!this.isValidURL(videoLink)) return;
    const params = new URL(videoLink).searchParams;
    this.currentVideoId = params.get('v') as string;
  }

  manageEnrollment(user: User) {
    if (!user) return;
    
    this.isCheckingEnrollment = true;
    this.courseEnrollment$ = this.enrollmentService
      .checkSubscriptionAndEnroll(user.id, this.courseID)
      .pipe(
        map((result: CourseEnrollment) => {
          this.isSubscriber = !!result;
          this.isCheckingEnrollment = false;
          return result;
        })
      );
  }

  ngOnInit(): void {
    const user = this.authService?.currentUsr;

    this.route.paramMap.subscribe((params) => {
      const parsedParams = params.get('course_id')?.split('-')[0];
      this.courseID = parsedParams!;
      this.getCourse(this.courseID);
      this.manageEnrollment(user);
    });

    this.chapters$ = this.chapterService.fetchAllChapters(this.courseID);

    // this.courseEnrollment$ = this.route.data.pipe(
    //   map(({ sub }) => {
    //     if (sub === true) return;

    //     this.isSubscriber = !!sub;
    //     return sub;
    //   })
    // );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
