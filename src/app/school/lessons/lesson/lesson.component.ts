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
import { Lesson } from '../lesson';
import { ChapterService } from '../../chapters/chapter.service';
import { FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CourseSubscription } from '../../studentCourse';
import { capitalizeString } from 'src/app/services/utilities.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';


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
  completeProgressVal: number;

  lessonID!: any;
  courseID!: any;
  courseSubscriptionID: any;

  course$: Observable<Course>;
  lessonVideo$: Observable<any>;
  lesson$: Observable<Lesson>;

  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;
  courseSubscription$: Observable<CourseSubscription>;
  prevLesson$: Observable<any>;
  nextLesson$: Observable<any>;
  nextLesson: Lesson;

  CompletedText$ = new Subject<boolean>();

  imageTypes = ['png', 'jpeg', 'jpg', 'svg'];

  completed: boolean;

  allChapters: Chapter[] = [];
  currentChapter: Chapter;

  isSubscriber:boolean;

  durations = [];

  constructor(
    private seo: SeoService,
    private vimeoService: VimeoService,
    public authService: AuthService,
    private lessonService: LessonService,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private vimeo: VimeoService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
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
    // const isCourseFullyCompleted = this.completeProgressVal == Math.round(100 * ((this.lessonsCount - 1) / this.lessonsCount)) ? true : false

    if (!this.completed) {
      this.courseService.markLessonAsComplete(data)
        .pipe(catchError(err => {
          return throwError(() => err)
        }))
        .subscribe(data => {
          this.completed = true;
          this.completeProgressVal = Math.round(100 * ([...new Set(data.completedLessons)].length / this.lessonsCount));
          if (this.nextLesson) this.router.navigateByUrl(`cours/${this.courseID}/${this.nextLesson.id}`);
        })
    } else {
      this.courseService.markLessonAsInComplete(data)
        .pipe(catchError(err => {
          return throwError(() => err)
        }))
        .subscribe(data => {
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

  loadCourseSubscription() {
    const userId = +(this.authService?.currentUsr as User)?.id
    const payload = { courseId: this.courseID, userId }
    this.isSubscriber = this.courseService.isSubscriber(+this.courseID);

    if (!userId) return;
    if (!this.isSubscriber) return;
    
    this.courseSubscription$ = this.courseService.findSubscribedByCourseId(payload)
      .pipe(
        catchError(err => {
          this.messageService.cancel();
          return throwError(() => err?.message)
        }),
        tap((data: CourseSubscription) => {
          this.isSubscriber = true;
          this.courseSubscriptionID = data.id;
          this.completedLessons = data.completedLessons;
          this.completedLessonsIds = [...new Set(data.completedLessons.map(l => l.id))];
          this.completed = this.isLessonCompleted(this.lesson);
          this.lessonsCount = data.course.lessonsCount;
          this.loadCompleteProgressBar(this.completedLessonsIds);
        }),
        shareReplay()
      )
  }

  loadLessonData(lessonId: any) {
    this.loading = true;
    if (lessonId == '?') {
      this.loading = false;
      return;
    }

    this.lesson$ = this.lessonService.findLessonById(lessonId)
      .pipe(
        catchError(err => {
          this.loading = false;
          return throwError(() => err?.message)
        }),
        tap((lesson: Lesson) => {
          this.lesson = lesson;
          this.completed = this.isLessonCompleted(lesson)
          this.lessonVideo$ = this.vimeoService.getOneVideo(lesson?.video);
          this.loading = false;
          this.videoID = lesson?.video?.split('com/')[1]

          // const options = {
          //   id: '804933075',
          //   // url: videoUrl,
          //   loop: false,
          //   autoplay: true,
          //   controls: true,
          //   muted: false,
          //   byline: false,
          //   portrait: false,
          //   title: false,
          //   responsive: true,
          //   playsinline: true,
          //   access_token: 'token'
          // };

          // setTimeout(() => {
          //   let player;

          //   try {
          //     if (this.playerContainer?.nativeElement) {
          //       player = new Player(this.playerContainer.nativeElement, options);
          //     }
          //   } catch (error) {
          //     console.error('Error creating Vimeo player:', error);
          //   }

          //   if (this.playerContainer?.nativeElement) {
          //     player.on('error', (error) => {
          //       console.error('Vimeo player error:', error);
          //     });
          //   }

          // }, 500);

          if (!this.allChapters.length) {
            setTimeout(() => {
              this.currentChapter = this.allChapters.find(chap => lesson.chapterId == chap.id);
              this.loadPrevNext(this.currentChapter, this.allChapters, lessonId)
            }, 1000);
          }else{
            this.currentChapter = this.allChapters.find(chap => lesson.chapterId == chap.id);
            this.loadPrevNext(this.currentChapter, this.allChapters, lessonId)
          }
        }),
        shareReplay()
      )
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
        })
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
            this.lesson = data[0].lessons[0]
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

  loadPrevNext(currentChapter: Chapter, allChapters: Chapter[], currentLessonId: any){

    const { prev, next } = this.loadPrevNextHelper(currentChapter, allChapters, currentLessonId) || {};

    this.prevLesson$ = of(prev)
      .pipe(map((data: Lesson) => data))
    this.nextLesson$ = of(next)
      .pipe(map((data: Lesson) => {
        this.nextLesson = data;
        return data;
      }))

  }

  loadPrevNextHelper(currentChapter: Chapter, allChapters: Chapter[], currentLessonId: any){
    if (!currentLessonId) return null;
    if (!currentChapter) return null;
    
    let currentChapterLessonList: Lesson[] = currentChapter?.lessons;
    
    const currentChapterIndex = allChapters.findIndex(chap => chap.id == currentChapter.id);
    const currentLessonIndex = currentChapterLessonList?.findIndex(lesson => lesson.id == currentLessonId);

    let prev = null, next = null;
    const prevChapterLastLessonIndex = allChapters[currentChapterIndex - 1]?.lessons.length - 1;
    const currentChapterLastLessonIndex = currentChapter?.lessons.length - 1;
    const nextChapterFirstLessonIndex = 0;
    const lastChapterIndex = allChapters?.length - 1

    if (currentLessonIndex < 0) {
      prev = null;
    } else if (currentLessonIndex == 0 && currentChapterIndex > 0) {
      const prevChapterLastLesson = allChapters[currentChapterIndex - 1].lessons[prevChapterLastLessonIndex]
      prev = prevChapterLastLesson;
    } else {
      prev = currentChapterLessonList[currentLessonIndex - 1]
    }

    if (currentLessonIndex < 0) {
      next = currentChapterLessonList[1];
    } else if (currentLessonIndex == currentChapterLastLessonIndex && currentChapterIndex < lastChapterIndex) {
      const nextChapterFirstLesson = allChapters[currentChapterIndex + 1].lessons[nextChapterFirstLessonIndex];
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
      const chapterLastLessonIndex = chap.lessons.length - 1;

      chap.lessons.forEach((lesson: Lesson, i) => {

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

  ngOnInit(): void {
    this.seo.unmountFooter();
    this.courseID = this.route.snapshot.paramMap.get('course_id');
    this.lessonID = this.route.snapshot.paramMap.get('lesson_id');

    this.loadCourseData(this.courseID);
    this.loadAllChapters(this.courseID, this.lessonID);
    
    this.route.paramMap.subscribe(
      params => {
        this.lessonID = params.get('lesson_id')!;
        this.loadLessonData(this.lessonID);
        this.loadCourseSubscription();
      }
    );
  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
