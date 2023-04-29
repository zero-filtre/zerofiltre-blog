import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChapterService } from '../chapter.service';

@Component({
  selector: 'app-chapter-update-popup',
  templateUrl: './chapter-update-popup.component.html',
  styleUrls: ['./chapter-update-popup.component.css']
})
export class ChapterUpdatePopupComponent implements OnInit {
  title: string = '';
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChapterUpdatePopupComponent>,
    private router: Router,
    private chapterService: ChapterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleChapterUpdate() {
    if (!this.title.trim()) return;
    this.loading = true;

    const payload = {
      ...this.data.chapter,
      title: this.title,
    }

    this.chapterService.updateChapter(payload)
      .subscribe(_data => {
        location.reload();
        // this.loading = false;
        // this.dialogRef.close();
      });
  }

  ngOnInit(): void {
    this.title = this.data.chapter.title;
  }

}
