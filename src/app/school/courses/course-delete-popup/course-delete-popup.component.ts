import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-delete-popup',
  templateUrl: './course-delete-popup.component.html',
  styleUrls: ['./course-delete-popup.component.css']
})
export class CourseDeletePopupComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CourseDeletePopupComponent>,
    private messageService: MessageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  handleDeleteArticle(): void {
    this.loading = true;

    this.courseService.deleteCourse(this.data.courseId)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.messageService.openSnackBarError("Une erreur s'est produite !", '');
          return throwError(() => err?.message)
        })
      )
      .subscribe(_data => {
        location.reload();
        this.loading = false;
        this.dialogRef.close();
      })
  }

  ngOnInit(): void {
    // do nothing.
  }

}
