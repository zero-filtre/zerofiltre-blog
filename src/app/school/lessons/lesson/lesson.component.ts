import { ChangeDetectorRef, Component, OnDestroy, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Observable, catchError, throwError, Subject, tap, map, of, shareReplay, forkJoin } from 'rxjs';
import { VimeoService } from '../../../services/vimeo.service';
import { Course } from '../../courses/course';
import { AuthService } from '../../../user/auth.service';
import { User } from '../../../user/user.model';
import { LessonService } from '../lesson.service';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../courses/course.service';
import { Chapter } from '../../chapters/chapter';
import { CompletedLesson, Lesson, Resource, UserProgress } from '../lesson';
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
import { MatDialog } from '@angular/material/dialog';
import { NpsSurveyComponent } from 'src/app/shared/nps-survey/nps-survey.component';


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
  imageResources: Resource[] = [];
  documentResources: Resource[] = [];
  courseResources: Course[] = [];

  completed: boolean;

  allChapters: Chapter[] = [];
  currentChapter: Chapter;

  isSubscriber: boolean;
  isCompleting: boolean;

  durations = [];

  userProgress: UserProgress = {};

  surveyJson = {
    elements: [
      {
        name: "firstName",
        title: "Entrez votre nom:",
        type: "text",
        defaultValue: 'Jason'
      }, {
        name: "lastName",
        title: "Entrez votre prénom:",
        type: "text",
        defaultValue: 'Derulo'
      },
      {
        name: 'satisfaction',
        title: 'À quel point êtes-vous satisfait de notre plateforme Zerofiltre ?',
        type: 'rating',
        defaultValue: '5'
      },
      {
        name: "subscribed",
        type: "boolean",
        renderAs: "checkbox",
        title: "J'accepte de recevoir des newsletters hebdomadaires",
      },
      {
        name: "start-date",
        title: "Sélectionnez une date de début de formation",
        type: "text",
        inputType: "date",
        defaultValueExpression: "today()"
      },
      {
        type: "rating",
        name: "nps_score",
        title: "Sur une échelle de zéro à dix, quelle est la probabilité que vous recommandiez notre produit à un ami ou un collègue ?",
        rateMin: 0,
        rateMax: 10,
        defaultValue: '10'
      }
      // {
      //   "name": "subscribed",
      //   "type": "checkbox",
      //   "title": "I agree to receive weekly newsletters 1",
      //   "defaultValue": true
      // },
    ]
  };

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
    private location: Location,
    private modalService: MatDialog,
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
          this.handleLessonCompletion(this.lesson.id, this.currentChapter, this.userProgress)
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
          this.userProgress[this.currentChapter.id].completedLessons.delete(this.lesson.id);
          console.log('USER PROGRESS: ', this.userProgress);
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

  isChapterCompleted(chapter: Chapter, userProgress: UserProgress): boolean {
    const chapterProgress = userProgress[chapter.id];
    if (!chapterProgress) return false;

    return chapter.lessons.every((lesson: Lesson) => chapterProgress.completedLessons.has(lesson.id));
  }

  showNPSFormDialog() {
    const modalRef = this.modalService.open(NpsSurveyComponent, {
      panelClass: 'popup-panel-nps',
    });

    modalRef.componentInstance.jsonSchema = this.surveyJson;
  }

  handleLessonCompletion(lessonId: number, chapter: Chapter, userProgress: UserProgress) {
    if (!userProgress[chapter.id]) {
      userProgress[chapter.id] = {
        completedLessons: new Set<number>(),
      };
    }

    userProgress[chapter.id].completedLessons.add(lessonId);

    if (this.isChapterCompleted(chapter, userProgress)) {
      this.showNPSFormDialog();
    }
    console.log('USER PROGRESS: ', userProgress, this.isChapterCompleted(chapter, userProgress));
  }

  findResourcesByType(type: string[] | string): Resource[] {
    const resources = this.lesson.resources
    if (Array.isArray(type)) {
      return resources.filter(res => type.includes(res.type))
    } else {
      return resources.filter(res => res.type === type)
    }
  }

  fetchCoursesResourceData(resources: Resource[]) {
    const ids = resources.map(res => parseInt(res.url.split('/').pop() || ''))

    const observables = ids.map(id => this.courseService.findCourseById(id));

    forkJoin(observables).subscribe({
      next: (courses: Course[]) => {
        this.courseResources = courses;
      },
      error: (error) => {
        console.error('Error fetching course data:', error);
      }
    });
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
          const img = this.course?.thumbnail || 'https://ik.imagekit.io/lfegvix1p/pro_vvcZRxQIU.png?updatedAt=1714202330763'

          this.seo.generateTags({
            title: lesson.title,
            description: desc,
            image: img
          })

          this.completed = this.isLessonCompleted(lesson)
          this.lessonVideo$ = this.vimeoService.getOneVideo(lesson?.video);
          this.loading = false;
          this.videoID = lesson?.video?.split('com/')[1]

          this.imageResources = this.findResourcesByType('img');
          this.documentResources = this.findResourcesByType(this.docTypes);
          const courseResources = this.findResourcesByType('course');

          if (courseResources?.length) {
            this.fetchCoursesResourceData(courseResources)
          }

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
        tap((data: Chapter[]) => {
          this.allChapters = data;
          this.loadingChapters = false;
          this.updateUserProgressForEachChapter(data)

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

    const payload = { productId: +this.courseID, productType: 'COURSE' }
    const type = 'product'

    this.paymentService.openPaymentDialog(payload, type, this.course);

  }

  subscribeToPro() {
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

  updateUserProgressForEachChapter(chapters: Chapter[]) {
    chapters.forEach((chapter: Chapter) => {
      chapter.lessons.forEach((lesson: Lesson) => {
        if (!this.userProgress[chapter.id]) {
          this.userProgress[chapter.id] = {
            completedLessons: new Set<number>(),
          };
        }
        
        if (this.isLessonCompleted(lesson)) {
          this.userProgress[chapter.id].completedLessons.add(lesson.id);
        }
      })
    })
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
