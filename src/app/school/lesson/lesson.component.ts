import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Observable, catchError, throwError } from 'rxjs';
import { VimeoService } from '../../services/vimeo.service';
import { Course } from '../course';
import { AuthService } from '../../user/auth.service';
import { User } from '../../user/user.model';
import { LessonService } from '../lesson.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../course.service';
import { Chapter } from '../chapter';
import { Lesson } from '../lesson';
import { ChapterService } from '../chapter.service';


@Component({
  selector: 'app-course-content',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit, OnDestroy {
  course!: Course;
  lesson!: any;
  loading: boolean = false;

  lessonID!: any;
  courseID!: any;

  canEdit: boolean = false;

  courseVideos$: Observable<any[]>;
  lessonVideo$: Observable<any>;

  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;

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
      .subscribe(data => {
        this.lesson = data;
        this.loading = false;
      })

  }

  loadCourseData(courseId: any) {
    this.loading = true;

    this.courseService.findCourseById(courseId)
      .pipe(catchError(err => {
        this.loading = false;
        this.messageService.openSnackBarError(err?.statusText, '');
        return throwError(() => err?.message)
      }))
      .subscribe(data => {
        this.course = data;
        this.loading = false;
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
        this.loadLessonData(this.lessonID, this.courseID);
        this.lessonVideo$ = this.vimeoService.getOneVideo();
      }
    );

  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
  }

}
