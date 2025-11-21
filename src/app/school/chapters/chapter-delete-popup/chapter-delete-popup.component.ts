import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { ChapterService } from '../chapter.service';

@Component({
  selector: 'app-chapter-delete-popup',
  templateUrl: './chapter-delete-popup.component.html',
  styleUrls: ['./chapter-delete-popup.component.css']
})
export class ChapterDeletePopupComponent {
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChapterDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chapterService: ChapterService,
    private messageService: MessageService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleDeleteChapter(): void {
    this.loading = true;

    this.chapterService.deleteChapter(this.data.chapterId)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.dialogRef.close();
          
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (_data) => {
          this.loading = false;
          this.dialogRef.close(this.data.indexChapter);
        },
        error: (err) => {
          this.messageService.openSnackBarError(err.error.error.reason, 'OK');
        }
      });
  }

}
