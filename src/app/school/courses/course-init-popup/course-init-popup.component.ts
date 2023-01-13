import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-init-popup',
  templateUrl: './course-init-popup.component.html',
  styleUrls: ['./course-init-popup.component.css']
})
export class CourseInitPopupComponent implements OnInit {
  public title: string = '';
  public loading: boolean = false;
  public course!: any;

  constructor(
    public dialogRef: MatDialogRef<CourseInitPopupComponent>,
    private router: Router,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleCourseInit(): void {
    if (!this.title.trim()) return;

    this.loading = true;

    this.courseService.initCourse(this.title)
      .pipe(catchError(err => {
        this.loading = false
        return throwError(() => err)
      }))
      .subscribe(_data => {
        this.dialogRef.close();
        this.loading = false;
        location.reload();
      });

  }

  ngOnInit(): void {
    // do nothing.
  }

}
