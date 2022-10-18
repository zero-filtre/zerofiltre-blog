import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../user/auth.service';
import { ChapterInitPopupComponent } from '../chapter-init-popup/chapter-init-popup.component';
import { ChapterDeletePopupComponent } from '../chapter-delete-popup/chapter-delete-popup.component';
import { LessonInitPopupComponent } from '../lesson-init-popup/lesson-init-popup.component';
import { LessonDeletePopupComponent } from '../lesson-delete-popup/lesson-delete-popup.component';

@Component({
  selector: 'app-curriculum-sidebar',
  templateUrl: './curriculum-sidebar.component.html',
  styleUrls: ['./curriculum-sidebar.component.css']
})
export class CurriculumSidebarComponent implements OnInit {
  @Input() drawer!: any;

  constructor(
    public authService: AuthService,
    public dialogNewChapterRef: MatDialog,
    private dialogDeleteChapterRef: MatDialog,
    private dialogNewLessonRef: MatDialog,
    private dialogDeleteLessonRef: MatDialog,
    private router: Router
  ) { }

  isAuthor(user: any, cours: any): boolean {
    return user?.id === cours?.author?.id
  }

  course: any = {
    name: 'Exemple de titre du cours, Apprenez le DDD',
    chapters: [
      {
        title: 'Titre du chapitre 1',
        lessons: [
          {
            type: 'video',
            name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure',
            duration: '3:15',
            free: true
          },
          {
            type: 'video',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'doc',
            name: 'lesson numero 3',
            duration: '0:15',
            free: true
          },
        ]
      },
      {
        title: 'Titre du chapitre 2',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'doc',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'video',
            name: 'lesson numero 3',
            duration: '0:15',
            free: false
          },
        ]
      },
      {
        title: 'Titre du chapitre 3',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'doc',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'video',
            name: 'lesson numero 3',
            duration: '0:15',
            free: false
          },
        ]
      },
      {
        title: 'Titre du chapitre 4',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'doc',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'video',
            name: 'lesson numero 3',
            duration: '0:15',
            free: false
          },
        ]
      },
      {
        title: 'Titre du chapitre 5',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'doc',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'video',
            name: 'lesson numero 3',
            duration: '0:15',
            free: false
          },
        ]
      }
    ]
  }

  openChapterInitDialog(): void {
    this.dialogNewChapterRef.open(ChapterInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
    });
  }

  openChapterDeleteDialog(chapterId: number | undefined): void {
    this.dialogDeleteChapterRef.open(ChapterDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: chapterId,
        history: this.router.url
      }
    });
  }

  openLessonInitDialog(): void {
    this.dialogNewLessonRef.open(LessonInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
    });
  }

  openLessonDeleteDialog(lessonId: number | undefined): void {
    this.dialogDeleteLessonRef.open(LessonDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: lessonId,
        history: this.router.url
      }
    });
  }

  ngOnInit(): void {
  }

}
