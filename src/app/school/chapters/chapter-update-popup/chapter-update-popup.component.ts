import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChapterService } from '../chapter.service';

@Component({
  selector: 'app-chapter-update-popup',
  templateUrl: './chapter-update-popup.component.html',
  styleUrls: ['./chapter-update-popup.component.css']
})
export class ChapterUpdatePopupComponent implements OnInit {
  title: string = '';
  index!: number;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChapterUpdatePopupComponent>,
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
        this.loading = false;
        this.dialogRef.close({title: this.title, index: this.data.indexChapter});
      });
  }

  ngOnInit(): void {
    this.title = this.data.chapter.title;
  }

}
