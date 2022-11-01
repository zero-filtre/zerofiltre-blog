import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { LessonService } from '../lesson.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-lesson-delete-popup',
  templateUrl: './lesson-delete-popup.component.html',
  styleUrls: ['./lesson-delete-popup.component.css']
})
export class LessonDeletePopupComponent implements OnInit {
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
          this.messageService.openSnackBarError("Une erreur s'est produite !", '');
          return throwError(() => err?.message)
        })
      )
      .subscribe(_data => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`${this.data.history}`);
          this.loading = false;
          this.dialogRef.close();
        })
      })
  }

  ngOnInit(): void {
  }

}
