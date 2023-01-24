import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Observable, switchMap, catchError, tap, throwError, BehaviorSubject, map } from 'rxjs';
import { Course, Reaction } from '../course';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';
import { ChapterService } from '../../chapters/chapter.service';
import { LessonService } from '../../lessons/lesson.service';
import { AuthService } from '../../../user/auth.service';
import { User } from '../../../user/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-detail-page',
  templateUrl: './course-detail-page.component.html',
  styleUrls: ['./course-detail-page.component.css']
})
export class CourseDetailPageComponent implements OnInit {
  STRIPE_PUBLIC_KEY = environment.stripePublicKey;

  courseID: string;
  course$: Observable<Course>;
  chapters$: Observable<Chapter[]>
  lessons$: Observable<Lesson[]>;
  course: Course;

  paymentHandler: any = null;

  public loading!: boolean;
  private isPublished = new BehaviorSubject<any>(null);
  public isPublished$ = this.isPublished.asObservable();

  private nberOfReactions = new BehaviorSubject<number>(0);
  public nberOfReactions$ = this.nberOfReactions.asObservable();
  public typesOfReactions = <any>[
    { action: 'clap', emoji: '👏' },
    { action: 'fire', emoji: '🔥' },
    { action: 'love', emoji: '💖' },
    { action: 'like', emoji: '👍' },
  ];

  private fireReactions = new BehaviorSubject<number>(0);
  public fireReactions$ = this.fireReactions.asObservable();
  private clapReactions = new BehaviorSubject<number>(0);
  public clapReactions$ = this.clapReactions.asObservable();
  private loveReactions = new BehaviorSubject<number>(0);
  public loveReactions$ = this.loveReactions.asObservable();
  private likeReactions = new BehaviorSubject<number>(0);
  public likeReactions$ = this.likeReactions.asObservable();

  constructor(
    private seo: SeoService,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private chapterService: ChapterService,
    private lessonService: LessonService,
    private notify: MessageService,
    private navigate: NavigationService,
    private authService: AuthService
  ) { }

  get canAccessCourse() {
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    return this.course?.author?.id === userId || this.course?.editorIds?.includes(userId) || this.authService.isAdmin || this.authService?.currentUsr?.courseIds?.includes(this.course.id);
  }

  subscribeToCourse() {
    const currUser = this.authService.currentUsr as User;
    const loggedIn = !!currUser;

    if (!loggedIn) {
      this.router.navigate(
        ['/login'],
        {
          relativeTo: this.route,
          queryParams: { redirectURL: this.router.url },
          queryParamsHandling: 'merge',
        });
    }

    const newIds = currUser.courseIds ? [...currUser?.courseIds, this.course.id] : [this.course.id]

    this.courseService.subscribeCourse({ courseId: this.course.id, userId: currUser.id, completedLessons: [] })
      .subscribe(_data => {
        this.authService.setUserData({ ...currUser, courseIds: newIds })
      })

  }

  getCourse(): Observable<any> {
    return this.courseService.findCourseById(this.courseID)
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            this.notify.openSnackBarError("Oops ce cours est n'existe pas 😣!", '');
            this.navigate.back();
          }
          return throwError(() => err?.message)
        }),
        tap(data => {
          this.course = data;
          this.setEachReactionTotal(data?.reactions);
          if (data.status === 'PUBLISHED') {
            this.isPublished.next(true);
          } else {
            this.isPublished.next(false);
          }
        })
      )
  }

  setEachReactionTotal(reactions: Reaction[]) {
    this.fireReactions.next(this.findTotalReactionByAction('FIRE', reactions));
    this.clapReactions.next(this.findTotalReactionByAction('CLAP', reactions));
    this.loveReactions.next(this.findTotalReactionByAction('LOVE', reactions));
    this.likeReactions.next(this.findTotalReactionByAction('LIKE', reactions));
  }

  findTotalReactionByAction(action: string, reactions: Reaction[]): number {
    return reactions.filter((reaction: Reaction) => reaction.action === action).length;
  }

  addReaction(action: string): any {
    // const currentUsr = this.authService?.currentUsr;

    // if (!currentUsr) {
    //   this.loginToAddReaction = true;
    //   return;
    // }
    // if (this.userHasAlreadyReactOnArticleFiftyTimes()) {
    //   this.maxNberOfReaction = true;
    //   return;
    // };

    this.courseService.addReactionToCourse(this.courseID, action)
      .subscribe({
        next: (response) => this.setEachReactionTotal(response)
      });
  }

  makePayment(amount: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.STRIPE_PUBLIC_KEY,
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log('TOKEN: ', stripeToken);
        alert('Stripe token generated!');
      },
    });
    paymentHandler.open({
      name: 'ZEROFILTRE',
      description: 'Changez vos finances grace au code',
      amount: amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.STRIPE_PUBLIC_KEY,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment connection has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  ngOnInit(): void {
    this.invokeStripe();

    this.course$ = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.courseID = params.get('course_id');

          this.chapters$ = this.chapterService
            .fetchAllChapters(this.courseID)

          this.lessons$ = this.chapterService.fetchChapterById(this.courseID)
            .pipe(map(data => data.lessons))

          return this.getCourse();
        })
      );

  }
}
