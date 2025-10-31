import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { LessonService } from '../lesson.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-lesson-delete-popup',
  templateUrl: './lesson-delete-popup.component.html',
  styleUrls: ['./lesson-delete-popup.component.css']
})
export class LessonDeletePopupComponent {
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LessonDeletePopupComponent>,
    private messageService: MessageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lessonService: LessonService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  handleDeleteChapter(): void {
    this.loading = true;

    this.lessonService.deleteLesson(this.data.lessonId)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.dialogRef.close();
          return throwError(() => err?.message)
        })
      )
      .subscribe(_data => {
        this.loading = false;
        console.log('this.data.indexChapter =', this.data.indexChapter);
        console.log('this.data.indexLesson =', this.data.indexLesson);
        this.dialogRef.close({indexChapter: this.data.indexChapter, indexLesson: this.data.indexLesson});
      })
  }
}
