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

  courseVideos$: Observable<any[]>;
  lessonVideo$: Observable<any>;

  chapters$: Observable<Chapter[]>;
  lessons$: Observable<Lesson[]>;

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

  get canAccessCourse() {
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    return this.course?.author?.id === userId || this.course?.editorIds?.includes(userId) || this.authService.isAdmin || this.authService?.currentUsr?.courseIds?.includes(this.course.id);
  }

  get canEditCourse() {
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    return this.course?.author?.id === userId || this.course?.editorIds?.includes(userId) || this.authService.isAdmin;
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

  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
  }

}
