import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-delete-popup',
  templateUrl: './course-delete-popup.component.html',
  styleUrls: ['./course-delete-popup.component.css']
})
export class CourseDeletePopupComponent {
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CourseDeletePopupComponent>,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  handleDeleteCourse(): void {
    this.loading = true;

    this.courseService.deleteCourse(this.data.courseId)
      .pipe(
        catchError(err => {
          this.loading = false;
          return throwError(() => err)
        })
      )
      .subscribe({
        next: (_data) => {
          location.reload();
          this.loading = false;
          this.dialogRef.close();
          this.messageService.openSnackBarSuccess("Le cours a bien été supprimé", 'OK');
        },
        error: (err) => {
          this.messageService.openSnackBarError(err, 'OK');
        }
      })
  }
}
