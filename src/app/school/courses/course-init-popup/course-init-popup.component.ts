import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

    const payload = {
      "title": this.title,
      "summary": "La description du cours...",
      "thumbnail": "",
      "firstLessonId": 1,
      "tags": [
        {
          "name": "tag 1"
        },
        {
          "name": "tag 2"
        }
      ],
      "enrolledCount": 0,
      "duration": 0,
      "chapterCount": 0,
      "lessonCount": 0,
      "editorIds": []
    }

    this.courseService.AddCourse(payload)
      .subscribe(_data => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`${this.data.history}`);
          this.loading = false;
          this.dialogRef.close();
        })
      });

  }

  ngOnInit(): void {
  }

}
