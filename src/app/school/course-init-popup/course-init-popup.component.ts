import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

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
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleCourseInit(): void {
    if (!this.title.trim()) return;

    this.loading = true;
    this.router.navigateByUrl(`cours/1/edit`);
  }

  ngOnInit(): void {
  }

}
