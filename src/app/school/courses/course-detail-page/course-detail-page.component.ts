import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Observable, switchMap, catchError, tap, throwError } from 'rxjs';
import { Course } from '../course';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../course.service';
import { MessageService } from '../../../services/message.service';
import { NavigationService } from '../../../services/navigation.service';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';
import { ChapterService } from '../../chapters/chapter.service';
import { LessonService } from '../../lessons/lesson.service';

@Component({
  selector: 'app-course-detail-page',
  templateUrl: './course-detail-page.component.html',
  styleUrls: ['./course-detail-page.component.css']
})
export class CourseDetailPageComponent implements OnInit {
  courseID: string;
  course$: Observable<Course>;
  chapters$: Observable<Chapter[]>
  lessons$: Observable<Lesson[]>;


  constructor(
    private seo: SeoService,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private chapterService: ChapterService,
    private lessonService: LessonService,
    private notify: MessageService,
    private navigate: NavigationService,
  ) { }

  getCourse(): Observable<any> {
    return this.courseService.findCourseById(this.courseID)
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            this.notify.openSnackBarError("Oops ce cours est n'existe pas 😣!", '');
            this.navigate.back();
          }
          return throwError(() => err?.message)
        }),
        tap(_ => {
          // do nothing.
        })
      )
  }

  ngOnInit(): void {
    this.course$ = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.courseID = params.get('course_id');

          this.chapters$ = this.chapterService
            .fetchAllChapters(this.courseID)
            .pipe(tap(data => console.log('CHAPTERS: ', data)))

          this.lessons$ = this.lessonService
            .fetchAllLessons(this.courseID)
            .pipe(tap(data => console.log('LESSONS: ', data)))

          return this.getCourse();;
        })
      );


  }
}
