import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../user/auth.service';
import { ChapterInitPopupComponent } from '../../chapters/chapter-init-popup/chapter-init-popup.component';
import { ChapterDeletePopupComponent } from '../../chapters/chapter-delete-popup/chapter-delete-popup.component';
import { LessonInitPopupComponent } from '../../lessons/lesson-init-popup/lesson-init-popup.component';
import { LessonDeletePopupComponent } from '../../lessons/lesson-delete-popup/lesson-delete-popup.component';
import { Course } from '../../courses/course';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';
import { ChapterUpdatePopupComponent } from '../../chapters/chapter-update-popup/chapter-update-popup.component';
import { capitalizeString } from 'src/app/services/utilities.service';
import { CourseService } from '../../courses/course.service';


@Component({
  selector: 'app-curriculum-sidebar',
  templateUrl: './curriculum-sidebar.component.html',
  styleUrls: ['./curriculum-sidebar.component.css']
})
export class CurriculumSidebarComponent implements OnInit {
  @Input() drawer!: any;
  @Input() canEdit!: boolean;
  @Input() course!: Course;
  @Input() lessons!: Lesson[];
  @Input() activeLessonID: number;
  @Input() chapters!: Chapter[];
  @Input() canAccessCourse!: boolean;
  @Input() loading!: boolean;
  @Input() completedLessonsIds!: number[];
  @Input() durations!: any[];
  @Input() mobileQuery: MediaQueryList;

  currentRoute: string;

  constructor(
    public authService: AuthService,
    private courseService: CourseService,
    public dialogNewChapterRef: MatDialog,
    private dialogDeleteChapterRef: MatDialog,
    private dialogUpdateChapterRef: MatDialog,
    private dialogNewLessonRef: MatDialog,
    private dialogDeleteLessonRef: MatDialog,
    private router: Router,
  ) { }

  isActiveLesson(lessonID: number) {
    return lessonID == this.activeLessonID
  }

  openChapterInitDialog(courseId: number): void {
    this.dialogNewChapterRef.open(ChapterInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        courseId,
        history: this.router.url
      }
    });
  }

  openChapterUpdateDialog(chapter: Chapter): void {
    this.dialogUpdateChapterRef.open(ChapterUpdatePopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        chapter,
        history: this.router.url
      }
    });
  }

  openChapterDeleteDialog(chapterId: number): void {
    this.dialogDeleteChapterRef.open(ChapterDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        chapterId,
        history: this.router.url
      }
    });
  }

  openLessonInitDialog(chapterId: number, courseId: number): void {
    this.dialogNewLessonRef.open(LessonInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        chapterID: chapterId,
        courseID: courseId,
        history: this.router.url
      }
    });
  }

  openLessonDeleteDialog(lessonId: number): void {
    this.dialogDeleteLessonRef.open(LessonDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        lessonId,
        history: this.router.url
      }
    });
  }

  capitalize(str: string): string {
    return capitalizeString(str);
  }

  publishCourse(course: Course) {
    this.courseService.publishCourse(course)
      .subscribe()
  }

  isLessonCompleted(lesson: Lesson): boolean {
    return this.completedLessonsIds?.includes(lesson?.id);
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }
}
