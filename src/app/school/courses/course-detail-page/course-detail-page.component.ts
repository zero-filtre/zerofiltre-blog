import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import {
  Observable,
  catchError,
  tap,
  BehaviorSubject,
  map,
  EMPTY,
  finalize,
} from 'rxjs';
import { Course, Section } from '../course';
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
import { JsonLdService } from 'ngx-seo';
import { JsonLd } from 'ngx-seo/lib/json-ld';
import { SlugUrlPipe } from 'src/app/shared/pipes/slug-url.pipe';
import { Location } from '@angular/common';
import { SurveyService } from 'src/app/services/survey.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { CourseInfosService } from '../course-infos.service';

@Component({
  selector: 'app-course-detail-page',
  templateUrl: './course-detail-page.component.html',
  styleUrls: ['./course-detail-page.component.css'],
})
export class CourseDetailPageComponent implements OnInit {
  STRIPE_PUBLIC_KEY = environment.stripePublicKey;

  courseID: string;
  companyId: string;
  course$: Observable<Course>;
  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;
  course: Course;
  chapters: Chapter[];

  courseEnrollment$: Observable<CourseEnrollment>;
  isSubscriber: boolean;
  isLoading: boolean;
  isCheckingEnrollment: boolean;
  isEditCourse!: boolean;

  notRedirectToFirstLesson: string;
  currentVideoId: string;
  orderedSections: Section[];
  mobileQuery: MediaQueryList;
  // paymentHandler: any = null;

  private readonly isPublished = new BehaviorSubject<any>(null);
  public isPublished$ = this.isPublished.asObservable();

  private readonly nberOfReactions = new BehaviorSubject<number>(0);
  public nberOfReactions$ = this.nberOfReactions.asObservable();

  constructor(
    private readonly seo: SeoService,
    private readonly jsonLd: JsonLdService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly chapterService: ChapterService,
    private readonly notify: MessageService,
    private readonly navigate: NavigationService,
    private readonly authService: AuthService,
    private readonly paymentService: PaymentService,
    private readonly surveyService: SurveyService,
    public dialogPaymentRef: MatDialog,
    public slugify: SlugUrlPipe,
    private readonly location: Location,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private readonly enrollmentService: EnrollmentService,
    private readonly courseInfosService: CourseInfosService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private readonly _mobileQueryListener: () => void;

  get canAccessCourse() {
    const user = this.authService?.currentUsr;
    return this.courseService.canAccessCourse(user, this.course);
  }

  get canEditCourse() {
    return this.isEditCourse;
  }

  buyCourse() {
    const payload = { productId: +this.courseID, productType: 'COURSE' };
    const type = 'basic';

    this.paymentService.openPaymentDialog(payload, type, this.course);
  }

  getCourse(courseId: string) {
    this.isLoading = true;
    const user = this.authService?.currentUsr;

    this.course$ = this.courseService.findCourseById(courseId, this.companyId).pipe(
      catchError((err) => {
        this.isLoading = false;
        this.router.navigateByUrl('**');
        return EMPTY;
      }),
      tap((data) => {
        if (data.status !== 'PUBLISHED' && !user) {
          this.router.navigateByUrl('**');
        } else if (data.status === 'PUBLISHED') {
          this.isPublished.next(true);
        } else {
          this.isPublished.next(false);
        }
      }),
      map((data: Course) => {
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
            name: data.author?.fullName,
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
            price: data.price?.toString(),
            priceCurrency: 'EUR',
          },
          provider: {
            '@type': 'Organization',
            name: 'Zerofiltre',
            sameAs: 'https://www.zerofiltre.tech',
          },
        } as JsonLd | any;

        this.jsonLd.setData(dataSchema);

        if(!this.isEditCourse) {
          this.manageEnrollment(user);

          this.isSubscriber = this.courseService.isSubscriber(data.id);
        }

        this.course = data;
        this.orderSections(data);
        this.extractVideoId(data.video);

        return data;
      })
    );
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
    this.currentVideoId = params.get('v');
  }

  manageEnrollment(user: User) {
    if (!user) return;

    this.isCheckingEnrollment = true;
    this.courseEnrollment$ = this.enrollmentService
      .checkSubscriptionAndEnroll(
        user.id,
        this.courseID,
        null,
        this.notRedirectToFirstLesson
      )
      .pipe(
        map((result: CourseEnrollment) => {
          this.isSubscriber = !!result;
          return result;
        }),
        finalize(() => {
          setTimeout(() => {
            this.isCheckingEnrollment = false;
          }, 100);
        })
      );
  }

  ngOnInit(): void {
    this.courseInfosService.isEditCourse$.subscribe(isEditCourse =>
      {this.isEditCourse = isEditCourse});

    this.route.queryParamMap.subscribe((query) => {
      this.companyId = query.get('companyId')!;
    });

    this.route.paramMap.subscribe((params) => {
      const parsedParams = params.get('course_id')?.split('-')[0];
      this.courseID = parsedParams!;
      this.getCourse(this.courseID);
    });

    this.route.queryParamMap.subscribe((query) => {
      this.notRedirectToFirstLesson = query.get('notRedirectToFirstLesson')!;
    });

    this.chapters$ = this.chapterService.fetchAllChapters(this.courseID).pipe(
      catchError((err) => {
        this.isLoading = false;
        this.router.navigateByUrl('**');
        return EMPTY;
      }),
      map((data) => (this.chapters = data)),
      finalize(() => (this.isLoading = false))
    );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
