import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
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
import { capitalizeString, slugify } from 'src/app/services/utilities.service';
import { CourseService } from '../../courses/course.service';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { isPlatformBrowser } from '@angular/common';

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
  @Input() activeChapterID: number;
  @Input() chapters!: Chapter[];
  @Input() canAccessCourse!: boolean;
  @Input() loading!: boolean;
  @Input() completedLessonsIds!: number[];
  @Input() durations!: any[];
  @Input() mobileQuery: MediaQueryList;
  @Input() exclusive: boolean;
  @Input() companyId: string;

  currentRoute: string;
  isPublishing: boolean;
  publishBtnText: string;

  constructor(
    public authService: AuthService,
    private readonly courseService: CourseService,
    public readonly dialogNewChapterRef: MatDialog,
    private readonly dialogDeleteChapterRef: MatDialog,
    private readonly dialogUpdateChapterRef: MatDialog,
    private readonly dialogNewLessonRef: MatDialog,
    private readonly dialogDeleteLessonRef: MatDialog,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly modalService: ModalService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {}

  scrollToChapter(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.querySelector('.sidebar_curriculum');
      if (el) {
        // el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }

  dropLessons(event: CdkDragDrop<Lesson[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const currPosition = event.currentIndex;
      const prevPosition = event.previousIndex;
      const draggedElement = event.item.dropContainer.data[
        event.currentIndex
      ] as Lesson;

      if (currPosition != prevPosition) {
        this.courseService
          .moveLesson(draggedElement.chapterId, draggedElement.id, currPosition)
          .subscribe((_data) => console.log('DRAGGED LESSON'));
      }
    }
  }

  dropChapters(event: CdkDragDrop<Chapter[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const currPosition = event.currentIndex + 1;
      const prevPosition = event.previousIndex + 1;
      const draggedElement = event.item.dropContainer.data[
        event.currentIndex
      ] as Chapter;

      if (currPosition != prevPosition) {
        this.courseService
          .moveChapter(draggedElement.id, currPosition)
          .subscribe((_data) => console.log('DRAGGED CHAPTER'));
      }
    }
  }

  sortByNumber(list: any[]) {
    return list.sort((a, b) => a.number - b.number);
  }

  isActiveLesson(lessonID: number) {
    return lessonID == this.activeLessonID;
  }

  openChapterInitDialog(courseId: number): void {
    this.dialogNewChapterRef.open(ChapterInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        courseId
      }
    })
    .afterClosed()
    .subscribe(newChapter => {
      if(newChapter) {
        this.chapters.push(newChapter);
        this.chapters = [...this.chapters];
      }
    });
  }

  openChapterUpdateDialog(chapter: Chapter, indexChapter: number): void {
    this.dialogUpdateChapterRef.open(ChapterUpdatePopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        chapter,
        indexChapter
      }
    })
    .afterClosed()
    .subscribe(chapterInfos => {
      if(chapterInfos){
        this.chapters[chapterInfos.index].title = chapterInfos.title;
        this.chapters = [...this.chapters];
      }
    });
  }

  openChapterDeleteDialog(chapterId: number, indexChapter: number): void {
    this.dialogDeleteChapterRef.open(ChapterDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        chapterId,
        indexChapter
      }
    })
    .afterClosed()
    .subscribe(indexChapter => {
      if(indexChapter) {
        this.chapters.splice(indexChapter);
        this.chapters = [...this.chapters];
      }
    });
  }

  openLessonInitDialog(chapterId: number, course: Course, indexChapter: number): void {
    this.dialogNewLessonRef.open(LessonInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        chapterID: chapterId,
        course,
        indexChapter,
        companyId: this.companyId
      }
    })
    .afterClosed()
    .subscribe(newLesson => {
      if(newLesson) {
        const lessons = this.chapters[newLesson.indexChapter].lessons;
        lessons.push(newLesson.lesson);
        this.chapters = [...this.chapters];
      }
    });
  }

  openLessonDeleteDialog(lessonId: number, indexChapter: number, indexLesson: number): void {
    this.dialogDeleteLessonRef.open(LessonDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        lessonId,
        indexChapter,
        indexLesson
      },
    })
    .afterClosed()
    .subscribe(data => {
      if(data) {
        const lessons = this.chapters[data.indexChapter].lessons;
        lessons.splice(data.indexLesson);

        this.chapters = [...this.chapters];

        const queryParams: { [key: string]: string } = {};
        if (this.companyId !== undefined) {
            queryParams['companyId'] = this.companyId;
        }

        const courseSlug = slugify(this.course);

        if(lessons.length > 0) {
          const lessonSlug = slugify(lessons[lessons.length - 1]);

          this.router.navigate([`/cours/${courseSlug}/${lessonSlug}`], { queryParams });
        } else {
          this.router.navigate([`/cours/${courseSlug}/?`], { queryParams });
        }
      }
    });
  }

  capitalize(str: string): string {
    return capitalizeString(str);
  }

  publishCourse(course: Course) {
    this.isPublishing = true;
    this.publishBtnText = (this.authService.isAdmin || this.exclusive)
      ? 'Publication'
      : 'Soumission';

    const { subTitle, summary } = course;
    if (subTitle == null) {
      course = {
        ...course,
        subTitle:
          'Ce sous titre est à titre indicatif, vous devrez le changer!',
      };
    }
    if (summary == null) {
      course = {
        ...course,
        summary: 'Ce sommaire est à titre indicatif, vous devrez le changer!',
      };
    }

    this.courseService
      .publishCourse(course)
      .pipe(
        catchError((err) => {
          this.isPublishing = false;
          this.publishBtnText = (this.authService.isAdmin || this.exclusive)
            ? 'Publier'
            : 'Soumettre';
          return throwError(() => err);
        }),
        tap((_data) => {
          const msg = (this.authService.isAdmin || this.exclusive)
            ? 'Publication reussie !'
            : 'Soumission reussie !';
          this.isPublishing = false;
          this.publishBtnText = (this.authService.isAdmin || this.exclusive)
            ? 'Publier'
            : 'Soumettre';
          this.messageService.openSnackBarSuccess(msg, 'OK');
        })
      )
      .subscribe();
  }

  isLessonCompleted(lesson: Lesson): Observable<boolean> {
    const res = this.completedLessonsIds?.includes(lesson?.id);
    return of(res);
  }

  addReaction(reactionType: string) {
    const currentUsr = this.authService?.currentUsr;

    if (!currentUsr) {
      this.modalService.openLoginModal();
      this.messageService.openSnackBarInfo(
        'Veuillez vous connecter pour réagir sur ce cours 🙂',
        'OK',
        5,
        'bottom',
        'center'
      );

      return;
    }

    if (this.course.status !== 'PUBLISHED') {
      this.messageService.openSnackBarInfo(
        'Vous pourrez réagir sur ce cours après sa publication.',
        'OK',
        5,
        'top',
        'center'
      );

      return;
    }

    this.courseService
      .addReactionToCourse(this.course.id, reactionType)
      .subscribe({
        next: (response) => {
          this.course = { ...this.course, reactions: response };
        },
      });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.publishBtnText = (this.authService.isAdmin || this.exclusive) ? 'Publier' : 'Soumettre';    
  }
}
