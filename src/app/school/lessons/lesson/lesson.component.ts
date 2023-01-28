import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Observable, catchError, throwError, Subject, tap, map, of } from 'rxjs';
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
  completedLessonsIds = <any>[];
  lessonsTotal: number;
  completeProgressVal: number;

  lessonID!: any;
  courseID!: any;
  courseSubscriptionID: any;

  courseVideos$: Observable<any[]>;
  lessonVideo$: Observable<any>;
  lesson$: Observable<Lesson>;

  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;
  completedLessonsIds$: Observable<any>;
  prevLesson$: Observable<any>;
  nextLesson$: Observable<any>;

  imageTypes = ['png', 'jpeg', 'jpg', 'svg'];

  completed: boolean;


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

  loadCompleteProgressBar(data: []) {
    const completed = data?.length;
    this.completeProgressVal = Math.round(100 * (completed / this.lessonsTotal)) || 0
  }

  isLessonCompleted(lesson: Lesson): boolean {
    return this.completedLessonsIds.includes(lesson?.id);
  }

  toggleCompleted() {
    if (!this.completed) {
      const courseCompleted = this.completeProgressVal == Math.round(100 * ((this.lessonsTotal - 1) / this.lessonsTotal)) ? true : false
      console.log('BAR2: ', Math.round(100 * ((this.lessonsTotal - 1) / this.lessonsTotal)))

      this.courseService.toggleCourseLessonProgressComplete({ subscriptionId: this.courseSubscriptionID, payload: { completedLessons: [...this.completedLessonsIds, this.lesson.id], completed: courseCompleted } })
        .pipe(catchError(err => {
          return throwError(() => err)
        }))
        .subscribe(data => {
          this.completed = true;
          this.completeProgressVal = Math.round(100 * ([...new Set(data.completedLessons)].length / this.lessonsTotal));
          this.router.navigateByUrl(`/cours/${this.courseID}/${+this.lessonID < this.lessonsTotal ? +this.lessonID + 1 : this.lessonID}`)
        })
    } else {
      this.courseService.toggleCourseLessonProgressComplete({ subscriptionId: this.courseSubscriptionID, payload: { completedLessons: this.completedLessonsIds.filter(d => d != this.lesson.id), completed: false } })
        .pipe(catchError(err => {
          return throwError(() => err)
        }))
        .subscribe(data => {
          this.completed = false;
          this.completeProgressVal = Math.round(100 * ([...new Set(data.completedLessons)].length / this.lessonsTotal));
        })
    }
  }

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

  loadSiblingTitles(lessonPos: any, courseId: any) {
    this.prevLesson$ = this.lessonService.findLessonByPosition(+lessonPos - 1, courseId)
      .pipe(map((data: Lesson) => data?.title))
    this.nextLesson$ = this.lessonService.findLessonByPosition(+lessonPos + 1, courseId)
      .pipe(map((data: Lesson) => data?.title))
  }

  loadCourseCompletedLessonsIds(): Observable<any> {
    const userId = (this.authService?.currentUsr as User)?.id
    return this.courseService.findSubscribedByCourseId(this.courseID, userId)
      .pipe(
        map((data: CourseSubscription) => {
          this.courseSubscriptionID = data.id;
          this.completedLessonsIds = [...new Set(data.completedLessons)];
          this.loadCompleteProgressBar(this.completedLessonsIds);
          return data;
        }),
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
    this.courseService.findCourseById(courseId)
      .pipe(catchError(err => {
        this.messageService.openSnackBarError(err?.statusText, '');
        return throwError(() => err?.message)
      }))
      .subscribe(data => {
        this.course = data;
      })
  }

  loadAllLessons(chapterId: any) {
    this.lessons$ = this.chapterService.fetchChapterById(chapterId)
      .pipe(
        map(data => {
          const res = data.lessons;
          this.lessonsTotal = res.length;
          return res;
        }),
      )
  }
  loadAllChapters(courseId: any) {
    this.loading = true;
    this.chapters$ = this.chapterService.fetchAllChapters(courseId)
    .pipe(tap(data => {
      this.loading = false;
      this.lesson = data[0]?.lessons[0];
      this.lesson$ = of(this.lesson);
      this.lessonVideo$ = this.vimeoService.getOneVideo(this.lesson?.video);
    }))
  }

  public capitalize(str: string): string {
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
        this.completedLessonsIds$ = this.loadCourseCompletedLessonsIds();
        this.loadLessonData(this.lessonID);

        // this.loadSiblingTitles(this.lessonID, this.courseID);
      }
    );
  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
  }

}
