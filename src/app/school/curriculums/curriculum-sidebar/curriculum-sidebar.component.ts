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
  @Input() chapters!: Chapter[];

  constructor(
    public authService: AuthService,
    public dialogNewChapterRef: MatDialog,
    private dialogDeleteChapterRef: MatDialog,
    private dialogUpdateChapterRef: MatDialog,
    private dialogNewLessonRef: MatDialog,
    private dialogDeleteLessonRef: MatDialog,
    private router: Router
  ) { }

  openChapterInitDialog(courseId: any): void {
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

  openChapterUpdateDialog(chapterId: any, chapterTitle: string): void {
    this.dialogUpdateChapterRef.open(ChapterUpdatePopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        chapterId,
        chapterTitle,
        history: this.router.url
      }
    });
  }

  openChapterDeleteDialog(chapterId: any): void {
    this.dialogDeleteChapterRef.open(ChapterDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        chapterId,
        history: this.router.url
      }
    });
  }

  openLessonInitDialog(chapterId: any, courseId: any): void {
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

  openLessonDeleteDialog(lessonId: any | undefined): void {
    this.dialogDeleteLessonRef.open(LessonDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        lessonId,
        history: this.router.url
      }
    });
  }

  ngOnInit(): void {
    // do nothing.
  }

}
