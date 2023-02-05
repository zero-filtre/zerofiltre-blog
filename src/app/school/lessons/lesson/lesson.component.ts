import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { FormGroup, FormBuilder } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CourseSubscription } from '../../studentCourse';
import { capitalizeString } from 'src/app/services/utilities.service';


@Component({
  selector: 'app-course-content',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit, OnDestroy, AfterViewInit {
  form!: FormGroup;
  color: ThemePalette = 'accent';

  course!: Course;
  lesson!: Lesson;
  loading: boolean;
  loadingCourse: boolean;
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

  imageTypes = ['png', 'jpeg', 'jpg', 'svg'];

  completed: boolean;

  allChapters: Chapter[] = [];
  currentChapter: Chapter;

  isSubscriber:boolean;

  @ViewChild('player', {static: false}) video: ElementRef;
  videoDuration: number = 130

  constructor(
    private fb: FormBuilder,
    private seo: SeoService,
    private vimeoService: VimeoService,
    public authService: AuthService,
    private lessonService: LessonService,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  CompletedText$ = new Subject<boolean>();

  get canAccessCourse() {
    const user = this.authService?.currentUsr as User
    return this.courseService.canAccessCourse(user, this.course)
  }
  get canEditCourse() {
    const user = this.authService?.currentUsr as User
    return this.courseService.canEditCourse(user, this.course);
  }

  toggleCompleted() {
    const data = { lessonId: this.lessonID, courseId: this.courseID };
    const isCourseFullyCompleted = this.completeProgressVal == Math.round(100 * ((this.lessonsCount - 1) / this.lessonsCount)) ? true : false

    if (!this.completed) {
      this.courseService.markLessonAsComplete(data)
        .pipe(catchError(err => {
          return throwError(() => err)
        }))
        .subscribe(data => {
          this.completed = true;
          this.completeProgressVal = Math.round(100 * ([...new Set(data.completedLessons)].length / this.lessonsCount));
          // this.router.navigateByUrl(`/cours/${this.courseID}/${+this.lessonID < this.lessonsCount ? +this.lessonID + 1 : this.lessonID}`)
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
          // this.lessonsCount = data.course.lessonsCount;
          this.loadCompleteProgressBar(this.completedLessonsIds);
        }),
        shareReplay()
      )
  }

  loadLessonData(lessonId: any) {
    if (lessonId == '?') return;
    this.loading = true;

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

          this.currentChapter = this.allChapters.find(chap => lesson.chapterId == chap.id);
          this.loadPrevNext(this.currentChapter)
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
          this.messageService.openSnackBarError(err?.statusText, '');
          return throwError(() => err?.message)
        }),
        tap(data => {
          this.loadingCourse = false;
          this.course = data;
          this.lessonsCount = data.lessonsCount;
        })
      )
  }

  loadAllChapters(courseId: any, lessonId: any) {
    this.loading = true;
    this.chapters$ = this.chapterService.fetchAllChapters(courseId)
    .pipe(
        tap(data => {
          this.loading = false;
          this.allChapters = data;

          if (lessonId === '?') {
            this.lesson = data[0].lessons[0]
            this.lessonID = this.lesson.id;
            this.lesson$ = of(this.lesson);
            this.lessonVideo$ = this.vimeoService.getOneVideo(this.lesson?.video);

            this.currentChapter = data[0];
            this.loadPrevNext(this.currentChapter)
          }
      }),
      shareReplay()
    )
  }

  loadPrevNext(chapter: Chapter){
    let lessonList: Lesson[] = chapter?.lessons;
    const currLessonId = +this.lessonID

    console.log('CHAPTER: ', chapter);

    if (!currLessonId) return
    if (!chapter) return

    const currentChapterIndex = this.allChapters.findIndex(chap => chap.id === chapter.id);
    const currLessonIndex = lessonList?.findIndex(lesson => lesson.id == currLessonId);

    
    let prev = null, next = null;
    const prevLastLessonIndex = this.allChapters[currentChapterIndex - 1]?.lessons.length - 1;
    const currentLastLessonIndex = chapter?.lessons.length - 1;
    const nextFirstLessonIndex = 0;
    const lastChapterIndex = this.allChapters?.length - 1

    if (currLessonIndex == 0 && currentChapterIndex > 0) {
      const prevLastLesson = this.allChapters[currentChapterIndex - 1].lessons[prevLastLessonIndex]
      prev = prevLastLesson;
    }else {
      prev = lessonList[currLessonIndex - 1]
    }

    if (currLessonIndex == currentLastLessonIndex && currentChapterIndex < lastChapterIndex){
      const nextFirstLesson = this.allChapters[currentChapterIndex + 1].lessons[nextFirstLessonIndex];
      next = nextFirstLesson;
    }else {
      next = lessonList[currLessonIndex + 1]
    }


    this.prevLesson$ = of(prev)
      .pipe(map((data: Lesson) => data))
    this.nextLesson$ = of(next)
      .pipe(map((data: Lesson) => data))

  }
  
  capitalize(str: string): string {
    return capitalizeString(str);
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
  }

  ngAfterViewInit() {
    const video = this.video?.nativeElement;

    // video.addEventListener('loadedmetadata', () => {
    //   this.videoDuration = video.duration;
    //   console.log('DURATION: ', this.videoDuration);
    // });
  }

}
