import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { LessonService } from '../lesson.service';
import { SlugUrlPipe } from 'src/app/shared/pipes/slug-url.pipe';

@Component({
  selector: 'app-lesson-init-popup',
  templateUrl: './lesson-init-popup.component.html',
  styleUrls: ['./lesson-init-popup.component.css']
})
export class LessonInitPopupComponent implements OnInit {
  public title: string = '';
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LessonInitPopupComponent>,
    private router: Router,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lessonService: LessonService,
    private slugify: SlugUrlPipe
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleLessonInit(): void {
    if (!this.title.trim()) return;

    this.loading = true;

    const payload =
    {
      title: this.title,
      chapterId: this.data.chapterID,
    }

    this.lessonService.initLesson(payload)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.dialogRef.close();
          return throwError(() => err?.message)
        })
      )
      .subscribe(lesson => {
        this.loading = false;
        this.dialogRef.close();
        this.router.navigateByUrl(`/cours/${this.slugify.transform(this.data.course)}/${this.slugify.transform(lesson)}/edit`)
      })
  }

  ngOnInit(): void {
    // console.log('DATA: ', this.data);
    // do nothing.
  }

}
