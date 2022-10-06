import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-lesson-init-popup',
  templateUrl: './lesson-init-popup.component.html',
  styleUrls: ['./lesson-init-popup.component.css']
})
export class LessonInitPopupComponent implements OnInit {
  public title: string = '';
  public loading: boolean = false;
  public course!: any;

  constructor(
    public dialogRef: MatDialogRef<LessonInitPopupComponent>,
    private router: Router,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleLessonInit(): void {
    if (!this.title.trim()) return;

    this.loading = true;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(`cours/1/1/edit`);
      this.loading = false;
      this.dialogRef.close();
    })
  }
  ngOnInit(): void {
  }

}
