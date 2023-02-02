import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class LessonComponent implements OnInit, OnDestroy {
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

  courseVideos$: Observable<any[]>;
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

  get isSubscriber() {
    const user = this.authService?.currentUsr as User
    return this.courseService.isSubscriber(user, this.course);
  }
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
        tap((data: CourseSubscription) => {
          this.courseSubscriptionID = data.id;
          this.completedLessons = data.completedLessons;
          this.completedLessonsIds = [...new Set(data.completedLessons.map(l => l.id))];
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
        })
      )

  }

  loadCourseData(courseId: any) {
    this.loadingCourse = true;
    this.courseService.findCourseById(courseId)
      .pipe(catchError(err => {
        this.loadingCourse = false;
        this.messageService.openSnackBarError(err?.statusText, '');
        return throwError(() => err?.message)
      }))
      .subscribe(data => {
        this.loadingCourse = false;
        this.course = data;
        this.lessonsCount = data.lessonsCount;
        this.loadCourseSubscription();
      })
  }

  loadAllChapters(courseId: any) {
    this.loading = true;
    this.chapters$ = this.chapterService.fetchAllChapters(courseId)
    .pipe(
        tap(data => {
          this.loading = false;
          
          this.allChapters = data;
          this.currentChapter = data[0];

          // this.lesson = data[0].lessons[0]
          // this.lesson$ = of(this.lesson);
          // this.lessonVideo$ = this.vimeoService.getOneVideo(this.lesson?.video);
      }),
      shareReplay()
    )
  }

  loadPrevNext(chapter: Chapter){
    let chapList: Lesson[] = chapter?.lessons;
    const currLessonId = +this.lessonID

    const endOfList = chapList?.length - 1;
    const currLessonIndex = chapList?.findIndex(less => less.id === currLessonId);
    const currentChapterIndex = this.allChapters.findIndex(chap => chap.id === chapter.id);

    const prev = chapList[currLessonIndex - 1]
    const next = chapList[currLessonIndex + 1]

    this.prevLesson$ = of(prev)
      .pipe(map((data: Lesson) => data?.title))
    this.nextLesson$ = of(next)
      .pipe(map((data: Lesson) => data?.title))

    if (currLessonIndex === endOfList) {
      this.currentChapter = this.allChapters[currentChapterIndex + 1]
      chapList = this.allChapters[currentChapterIndex + 1]?.lessons
    }
  }
  
  capitalize(str: string): string {
    return capitalizeString(str);
  }

  ngOnInit(): void {
    this.seo.unmountFooter();
    this.courseID = this.route.snapshot.paramMap.get('course_id');

    this.loadCourseData(this.courseID);
    this.loadAllChapters(this.courseID);

    this.route.paramMap.subscribe(
      params => {
        this.lessonID = params.get('lesson_id')!;
        this.courseID = params.get('course_id')!;
        this.loadLessonData(this.lessonID);
        this.loadCourseSubscription();
      }
    );
  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
  }

}
