import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { ChapterService } from '../chapter.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-chapter-init-popup',
  templateUrl: './chapter-init-popup.component.html',
  styleUrls: ['./chapter-init-popup.component.css']
})
export class ChapterInitPopupComponent implements OnInit {
  public title: string = '';
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChapterInitPopupComponent>,
    private router: Router,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chapterService: ChapterService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleChapterInit(): void {
    if (!this.title.trim()) return;

    const payload =
    {
      title: this.title,
      courseId: this.data.courseId
    }

    this.loading = true;

    this.chapterService.AddChapter(payload)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.dialogRef.close();
          return throwError(() => err?.message)
        })
      )
      .subscribe(_data => {
        location.reload();
        // this.loading = false;
        // this.dialogRef.close();
      })

  }

  ngOnInit(): void {
    // do nothing.
  }

}
