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
import { Observable, of } from 'rxjs';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


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

  dropLessons(event: CdkDragDrop<Lesson[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // const elementId = +event.item.element.nativeElement.id

      const currPosition = event.currentIndex
      const draggedElement = event.item.dropContainer.data[event.currentIndex] as Lesson

      this.courseService.moveLesson(draggedElement.chapterId, draggedElement.id, currPosition)
        .subscribe(_data => console.log('DRAGGED RESPONSE LESSON'))

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  dropChapters(event: CdkDragDrop<Chapter[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const currPosition = event.currentIndex
      const draggedElement = event.item.dropContainer.data[event.currentIndex] as Chapter

      this.courseService.moveChapter(draggedElement.id, currPosition)
        .subscribe(_data => console.log('DRAGGED RESPONSE CHAPTER'))

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

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

  isLessonCompleted(lesson: Lesson): Observable<boolean> {
    const res = this.completedLessonsIds?.includes(lesson?.id)
    return of(res);
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }
}
