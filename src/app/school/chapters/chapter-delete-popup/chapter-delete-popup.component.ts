import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { ChapterService } from '../chapter.service';

@Component({
  selector: 'app-chapter-delete-popup',
  templateUrl: './chapter-delete-popup.component.html',
  styleUrls: ['./chapter-delete-popup.component.css']
})
export class ChapterDeletePopupComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChapterDeletePopupComponent>,
    private messageService: MessageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chapterService: ChapterService
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
    // do nothing.
  }

}
