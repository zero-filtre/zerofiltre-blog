import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Observable, catchError, throwError, Subject, tap, map } from 'rxjs';
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
      this.courseService.toggleCourseLessonProgressComplete({ subscriptionId: this.courseSubscriptionID, payload: { completedLessons: [...this.completedLessonsIds, this.lesson.id] } })
        .pipe(catchError(err => {
          return throwError(() => err)
        }))
        .subscribe(data => {
          this.completed = true;
          this.completeProgressVal = Math.round(100 * ([...new Set(data.completedLessons)].length / this.lessonsTotal));
          this.router.navigateByUrl(`/cours/${this.courseID}/${+this.lessonID < this.lessonsTotal ? +this.lessonID + 1 : this.lessonID}`)
        })
    } else {
      this.courseService.toggleCourseLessonProgressComplete({ subscriptionId: this.courseSubscriptionID, payload: { completedLessons: this.completedLessonsIds.filter(d => d != this.lesson.id) } })
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
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    return this.authService?.currentUsr?.courseIds?.includes(this.course?.id);
  }

  get canAccessCourse() {
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    return this.course?.author?.id === userId || this.course?.editorIds?.includes(userId) || this.authService.isAdmin || this.authService?.currentUsr?.courseIds?.includes(this.course?.id);
  }

  get canEditCourse() {
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    return this.course?.author?.id === userId || this.course?.editorIds?.includes(userId) || this.authService.isAdmin;
  }

  loadSiblingTitles(lessonPos: any, courseId: any) {
    this.prevLesson$ = this.lessonService.findLessonByPosition(+lessonPos - 1, courseId)
      .pipe(map((data: Lesson) => data.title))
    this.nextLesson$ = this.lessonService.findLessonByPosition(+lessonPos + 1, courseId)
      .pipe(map((data: Lesson) => data.title))
  }

  loadCourseCompletedLessonsIds(): Observable<any> {
    const userId = (this.authService?.currentUsr as User)?.id
    return this.courseService.findSubscribedByCourseId(this.courseID, userId)
      .pipe(
        map((data: CourseSubscription) => {
          this.courseSubscriptionID = data.id;
          this.completedLessonsIds = data.completedLessons;
          this.loadCompleteProgressBar(this.completedLessonsIds);
          return data;
        }),
      )
  }

  loadLessonData(lessonId: any, courseId: any) {
    this.loading = true;

    this.lessonService.findLessonByPosition(lessonId, courseId)
      .pipe(catchError(err => {
        this.loading = false;
        this.messageService.openSnackBarError(err?.statusText, '');
        return throwError(() => err?.message)
      }))
      .subscribe((data: Lesson) => {
        setTimeout(() => {
          this.completed = this.isLessonCompleted(data)
          this.lesson = data;
          this.lessonVideo$ = this.vimeoService.getOneVideo(data?.video);
          this.loading = false;
        }, 1000);
      })

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

  loadAllLessons(courseId: any) {
    this.lessons$ = this.lessonService.fetchAllLessons(courseId)
      .pipe(tap(data => this.lessonsTotal = data.length))
  }
  loadAllChapters(courseId: any) {
    this.chapters$ = this.chapterService.fetchAllChapters(courseId);
  }

  ngOnInit(): void {
    this.seo.unmountFooter();
    this.courseID = this.route.snapshot.paramMap.get('course_id');

    this.loadCourseData(this.courseID);
    this.loadAllChapters(this.courseID);
    this.loadAllLessons(this.courseID);

    this.route.paramMap.subscribe(
      params => {
        this.lessonID = params.get('lesson_id')!;
        this.courseID = params.get('course_id')!;
        this.loadLessonData(this.lessonID, this.courseID);
        this.loadSiblingTitles(this.lessonID, this.courseID);
        this.completedLessonsIds$ = this.loadCourseCompletedLessonsIds();
      }
    );
  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
  }

}
