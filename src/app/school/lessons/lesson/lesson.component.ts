import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Observable, catchError, throwError } from 'rxjs';
import { VimeoService } from '../../../services/vimeo.service';
import { Course } from '../../courses/course';
import { AuthService } from '../../../user/auth.service';
import { User } from '../../../user/user.model';
import { LessonService } from '../lesson.service';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../courses/course.service';
import { Chapter } from '../../chapters/chapter';
import { Lesson } from '../lesson';
import { ChapterService } from '../../chapters/chapter.service';
import { FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CourseEnrollment } from '../../studentCourse';
import { capitalizeString } from 'src/app/services/utilities.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/services/payment.service';


@Component({
  selector: 'app-course-content',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit, OnDestroy {
  course!: Course;
  lesson!: Lesson;
  loading: boolean;

  lessonID!: any;
  courseID!: any;
  courseEnrollmentID: any;

  courseVideos$: Observable<any[]>;
  lessonVideo$: Observable<any>;

  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;
  courseEnrollment$: Observable<CourseEnrollment>;
  prevLesson$: Observable<any>;
  nextLesson$: Observable<any>;
  nextLesson: Lesson;

  CompletedText$ = new Subject<boolean>();

  imageTypes = ['png', 'jpeg', 'jpg', 'svg'];

  constructor(
    private seo: SeoService,
    private vimeoService: VimeoService,
    public authService: AuthService,
    private lessonService: LessonService,
    private chapterService: ChapterService,
    private courseService: CourseService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  canEditCourse(course: Course) {
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    this.canEdit = course?.author?.id === userId || course?.editorIds?.includes(userId) || this.authService.isAdmin;
    return this.canEdit;
  }

  loadLessonData(lessonId: any, courseId: any) {
    this.loading = true;

    this.lessonService.findLessonById(lessonId, courseId)
      .pipe(catchError(err => {
        this.loading = false;
        this.messageService.openSnackBarError(err?.statusText, '');
        return throwError(() => err?.message)
      }))
      .subscribe((data: Lesson) => {
        setTimeout(() => {
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
    this.lessons$ = this.lessonService.fetchAllLessons(courseId);
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
      }
    );

    this.courseEnrollment$ = this.route.data
      .pipe(
        map(({ sub }) => {
          if (sub === true) return;

          this.isSubscriber = !!sub;
          this.courseEnrollmentID = sub.id
          this.completedLessons = sub.completedLessons;
          this.completedLessonsIds = [...new Set(sub.completedLessons.map((l:Lesson) => l.id))] as number[];
          this.completed = this.isLessonCompleted(this.lesson);
          this.lessonsCount = sub.course.lessonsCount;
          this.loadCompleteProgressBar(this.completedLessonsIds);

          return sub
        })
      )
  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
  }

}
