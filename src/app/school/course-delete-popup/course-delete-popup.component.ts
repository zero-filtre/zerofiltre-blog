import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

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
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  handleDeleteArticle(): void {
    this.loading = true;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(`${this.data.history}`);
      this.loading = false;
      this.dialogRef.close();
    })
  }

  ngOnInit(): void {
  }

}
