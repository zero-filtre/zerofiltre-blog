import { ChangeDetectorRef, Component, OnDestroy, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Observable, catchError, throwError, Subject, tap, map, of, shareReplay } from 'rxjs';
import { VimeoService } from '../../../services/vimeo.service';
import { Course } from '../../courses/course';
import { AuthService } from '../../../user/auth.service';
import { User } from '../../../user/user.model';
import { LessonService } from '../lesson.service';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../courses/course.service';
import { Chapter } from '../../chapters/chapter';
import { CompletedLesson, Lesson, Resource } from '../lesson';
import { ChapterService } from '../../chapters/chapter.service';
import { FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CourseEnrollment } from '../../studentCourse';
import { capitalizeString } from 'src/app/services/utilities.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/services/payment.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SlugUrlPipe } from 'src/app/shared/pipes/slug-url.pipe';
import { Location } from '@angular/common';


@Component({
  selector: 'app-course-content',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit, OnDestroy {
  readonly accessToken = environment.vimeoToken;
  videoID: string;

  mobileQuery: MediaQueryList;
  isSidenavOpen = false;
  @ViewChild('snav') sidenav: MatSidenav;
  @ViewChild('playerContainer') playerContainer: ElementRef<HTMLDivElement>;

  form!: FormGroup;
  color: ThemePalette = 'accent';

  course!: Course;
  lesson!: Lesson;
  loading: boolean;
  loadingCourse: boolean;
  loadingChapters: boolean;
  completedLessonsIds: number[] = [];
  completedLessons: Lesson[] = [];
  lessonsCount: number;
  completeProgressVal: number = 0;

  lessonID!: any;
  courseID!: any;
  courseEnrollmentID: any;

  course$: Observable<Course>;
  lessonVideo$: Observable<any>;
  lesson$: Observable<Lesson>;

  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;
  courseEnrollment$: Observable<CourseEnrollment>;
  prevLesson$: Observable<any>;
  nextLesson$: Observable<any>;
  nextLesson: Lesson;

  CompletedText$ = new Subject<boolean>();

  docTypes = ['txt', 'doc', 'pdf'];

  completed: boolean;

  allChapters: Chapter[] = [];
  currentChapter: Chapter;

  isSubscriber: boolean;
  isCompleting: boolean;

  durations = [];

  constructor(
    private seo: SeoService,
    private vimeoService: VimeoService,
    public authService: AuthService,
    private lessonService: LessonService,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private messageService: MessageService,
    private navigate: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
    private vimeo: VimeoService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private paymentService: PaymentService,
    private slugify: SlugUrlPipe,
    private location: Location
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  get canAccessCourse() {
    const user = this.authService?.currentUsr as User
    return this.courseService.canAccessCourse(user, this.course) || this.isSubscriber
  }
  get canEditCourse() {
    const user = this.authService?.currentUsr as User
    return this.courseService.canEditCourse(user, this.course);
  }

  @HostListener('document:keydown.control.b', ['$event'])
  @HostListener('document:keydown.meta.b', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.toggleSidenav();
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sidenav.toggle();
  }

  toggleCompleted() {
    const data = { lessonId: this.lessonID, courseId: this.courseID };
    this.isCompleting = true;
    // const isCourseFullyCompleted = this.completeProgressVal == Math.round(100 * ((this.lessonsCount - 1) / this.lessonsCount)) ? true : false

    if (!this.completed) {
      this.courseService.markLessonAsComplete(data)
        .pipe(catchError(err => {
          this.isCompleting = false;
          return throwError(() => err)
        }))
        .subscribe(data => {
          this.isCompleting = false;
          this.completed = true;
          this.completeProgressVal = Math.round(100 * ([...new Set(data.completedLessons)].length / this.lessonsCount));
          if (this.nextLesson) this.router.navigateByUrl(`cours/${this.slugify.transform(this.course)}/${this.slugify.transform(this.nextLesson)}`);
        })
    } else {
      this.courseService.markLessonAsInComplete(data)
        .pipe(catchError(err => {
          this.isCompleting = false;
          return throwError(() => err)
        }))
        .subscribe(data => {
          this.isCompleting = false;
          this.completed = false;
          this.completeProgressVal = Math.round(100 * ([...new Set(data.completedLessons)].length / this.lessonsCount));
        })
    }
  }

  loadCompleteProgressBar(lessonsIds: number[]) {
    const completedLessonCount = lessonsIds?.length;
    this.completeProgressVal = Math.round(100 * (completedLessonCount / this.lessonsCount)) || 0
  }

  isLessonCompleted(lesson: Lesson): boolean {
    return this.completedLessonsIds.includes(lesson?.id);
  }

  loadLessonData(lessonId: any) {
    this.loading = true;
    if (lessonId == '?') {
      this.loading = false;
      return;
    }

    this.lessonService.findLessonById(lessonId)
      .subscribe({
        next: (lesson: Lesson) => {
          this.lesson = lesson;

          const rootUrl = this.router.url.split('/')[1];
          const sluggedUrl = `${rootUrl}/${this.slugify.transform(this.course)}/${this.slugify.transform(lesson)}`
          this.location.replaceState(sluggedUrl);

          const desc = lesson?.summary || '';
          const img = this.course?.thumbnail || 'https://ik.imagekit.io/lfegvix1p/Cours_pR5bDOPMu.svg?updatedAt=1655393997065'

          this.seo.generateTags({
            title: lesson.title,
            description: desc,
            image: img
          })

          this.completed = this.isLessonCompleted(lesson)
          this.lessonVideo$ = this.vimeoService.getOneVideo(lesson?.video);
          this.loading = false;
          this.videoID = lesson?.video?.split('com/')[1]

          if (!this.allChapters?.length) {
            setTimeout(() => {
              this.currentChapter = this.allChapters.find(chap => lesson.chapterId == chap.id);
              this.loadPrevNext(this.currentChapter, this.allChapters, lessonId)
            }, 1000);
          } else {
            this.currentChapter = this.allChapters.find(chap => lesson.chapterId == chap.id);
            this.loadPrevNext(this.currentChapter, this.allChapters, lessonId)
          }
        },
        error: err => {
          this.loading = false;

          if (err.status === 404) {
            this.messageService.openSnackBarError("Oops ce cours est n'existe pas 😣!", '');
            this.navigate.back();
          }
          return throwError(() => err?.message)
        },
        complete: () => {
          this.loading = false;
          return this.lesson;
        }
      })
  }

  loadCourseData(courseId: any) {
    this.loadingCourse = true;
    this.course$ = this.courseService.findCourseById(courseId)
      .pipe(
        catchError(err => {
          this.loadingCourse = false;
          return throwError(() => err?.message)
        }),
        tap(data => {
          this.loadingCourse = false;
          this.course = data;

          const rootUrl = this.router.url.split('/')[1];
          const sluggedUrl = `${rootUrl}/${this.slugify.transform(this.course)}/${this.slugify.transform(this.lesson)}`
          this.location.replaceState(sluggedUrl);
        }),
        shareReplay()
      )
  }

  loadAllChapters(courseId: any, lessonId: any) {
    this.loadingChapters = true;
    this.chapters$ = this.chapterService.fetchAllChapters(courseId)
      .pipe(
        catchError(err => {
          this.loadingChapters = false;
          return throwError(() => err?.message)
        }),
        tap(data => {
          this.allChapters = data;
          this.loadingChapters = false;

          // this.getEachLessonDuration(data);

          if (lessonId === '?') {
            this.lesson = data[0]?.lessons[0]
            this.lessonID = this.lesson?.id;
            this.lesson$ = of(this.lesson);
            this.lessonVideo$ = this.vimeoService.getOneVideo(this.lesson?.video);

            this.currentChapter = data[0];
            this.loadPrevNext(this.currentChapter, this.allChapters, lessonId)
          }
        }),
        shareReplay()
      )
  }

  loadPrevNext(currentChapter: Chapter, allChapters: Chapter[], currentLessonId: any) {

    const { prev, next } = this.loadPrevNextHelper(currentChapter, allChapters, currentLessonId) || {};

    this.prevLesson$ = of(prev)
      .pipe(map((data: Lesson) => data))
    this.nextLesson$ = of(next)
      .pipe(map((data: Lesson) => {
        this.nextLesson = data;
        return data;
      }))

  }

  loadPrevNextHelper(currentChapter: Chapter, allChapters: Chapter[], currentLessonId: any) {
    if (!currentLessonId) return null;
    if (!currentChapter) return null;

    let currentChapterLessonList: Lesson[] = currentChapter?.lessons;

    const currentChapterIndex = allChapters.findIndex(chap => chap.id == currentChapter.id);
    const currentLessonIndex = currentChapterLessonList?.findIndex(lesson => lesson.id == currentLessonId);

    let prev = null, next = null;
    const prevChapterLastLessonIndex = allChapters[currentChapterIndex - 1]?.lessons?.length - 1;
    const currentChapterLastLessonIndex = currentChapter?.lessons?.length - 1;
    const nextChapterFirstLessonIndex = 0;
    const lastChapterIndex = allChapters?.length - 1

    if (currentLessonIndex < 0) {
      prev = null;
    } else if (currentLessonIndex == 0 && currentChapterIndex > 0) {
      const prevChapterLastLesson = allChapters[currentChapterIndex - 1]?.lessons[prevChapterLastLessonIndex]
      prev = prevChapterLastLesson;
    } else {
      prev = currentChapterLessonList[currentLessonIndex - 1]
    }

    if (currentLessonIndex < 0) {
      next = currentChapterLessonList[1];
    } else if (currentLessonIndex == currentChapterLastLessonIndex && currentChapterIndex < lastChapterIndex) {
      const nextChapterFirstLesson = allChapters[currentChapterIndex + 1]?.lessons[nextChapterFirstLessonIndex];
      next = nextChapterFirstLesson;
    } else {
      next = currentChapterLessonList[currentLessonIndex + 1]
    }

    return { prev, next };
  }

  capitalize(str: string): string {
    return capitalizeString(str);
  }

  getEachLessonDuration(chapters: Chapter[]) {

    chapters.forEach((chap: Chapter) => {
      const chapterLessonsDurations = []
      const chapterLastLessonIndex = chap.lessons?.length - 1;

      chap?.lessons.forEach((lesson: Lesson, i) => {

        const videoId = lesson.video?.split('.com/')[1] || ''
        if (!videoId) {

        }

        this.vimeo.getVideo(videoId)
          .pipe(catchError(err => {
            chapterLessonsDurations.push('');
            if (i == chapterLastLessonIndex) {
              this.durations.push(chapterLessonsDurations)
              console.log('DURATIONS: ', this.durations);
            }
            return throwError(() => err?.message);
          }))
          .subscribe(({ duration }) => {
            chapterLessonsDurations.push(duration)
            if (i == chapterLastLessonIndex) {
              this.durations.push(chapterLessonsDurations)
              console.log('DURATIONS VALID: ', this.durations);
            }
          })

      });
    })

  }


  buyCourse() {

    // const currUser = this.authService.currentUsr as User;
    // const loggedIn = !!currUser;

    // if (!loggedIn) {
    //   this.router.navigate(
    //     ['/login'],
    //     {
    //       relativeTo: this.route,
    //       queryParams: { redirectURL: this.router.url },
    //       queryParamsHandling: 'merge',
    //     });

    //   this.messageService.openSnackBarInfo('Veuillez vous connecter pour acheter ce cours 🙂', 'OK');

    //   return;
    // }

    const payload = { productId: +this.courseID, productType: 'COURSE' }
    const type = 'product'

    this.paymentService.openPaymentDialog(payload, type, this.course);

  }

  subscribeToPro() {

    // const currUser = this.authService.currentUsr as User;
    // const loggedIn = !!currUser;

    // if (!loggedIn) {
    //   this.router.navigate(
    //     ['/login'],
    //     {
    //       relativeTo: this.route,
    //       queryParams: { redirectURL: this.router.url },
    //       queryParamsHandling: 'merge',
    //     });

    //   this.messageService.openSnackBarInfo('Veuillez vous connecter pour prendre votre abonnement PRO 🤗', 'OK');

    //   return;
    // }

    // const payload = { productId: +this.courseID, productType: 'COURSE' }
    // const type = 'pro'

    // this.paymentService.openPaymentDialog(payload, type, this.course);

    this.router.navigateByUrl('/pro');

  }

  async downloadFileContent(res: Resource) {
    const response = await fetch(res.url);
    const blob = await response.blob();
    const _url = window.URL.createObjectURL(blob);
    const a = document.createElement('a')

    a.setAttribute('href', _url)
    a.setAttribute('download', res.name)
    a.click()
  }

  isZIPFile(res: Resource): boolean {
    const parts = res.url.split('.')
    const ext = parts[parts.length - 1]

    return ext === "zip";
  }

  isTXTFile(res: Resource): boolean {
    const parts = res.url.split('.')
    const ext = parts[parts.length - 1]

    return ext === "txt";
  }

  ngOnInit(): void {
    this.seo.unmountFooter();
    this.courseID = this.route.snapshot.paramMap.get('course_id')?.split('-')[0];
    this.lessonID = this.route.snapshot.paramMap.get('lesson_id')?.split('-')[0];

    this.loadCourseData(this.courseID);
    this.loadAllChapters(this.courseID, this.lessonID);

    this.route.paramMap.subscribe(
      params => {
        const parsedParams = params.get('lesson_id')?.split('-')[0]
        this.lessonID = parsedParams!;
        this.loadLessonData(this.lessonID);
      }
    );

    this.courseEnrollment$ = this.route.data
      .pipe(
        map(({ sub }) => {
          if (sub === true) return;

          this.isSubscriber = !!sub;
          this.courseEnrollmentID = sub?.id
          this.completedLessons = sub?.completedLessons;
          this.completedLessonsIds = [...new Set(sub?.completedLessons?.map((l: CompletedLesson) => l.lessonId))] as number[];
          this.completed = this.isLessonCompleted(this.lesson);
          this.lessonsCount = sub?.course?.lessonsCount;
          this.loadCompleteProgressBar(this.completedLessonsIds);

          return sub
        })
      )
  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
