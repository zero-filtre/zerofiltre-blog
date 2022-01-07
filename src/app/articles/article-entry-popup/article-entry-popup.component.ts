import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-article-entry-popup',
  templateUrl: './article-entry-popup.component.html',
  styleUrls: ['./article-entry-popup.component.css']
})
export class ArticleEntryPopupComponent implements OnInit {
  public title!: string;
  public placeholder!: string

  constructor(
    public dialogRef: MatDialogRef<ArticleEntryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = '';
    this.placeholder = 'Tout commence par un titre!'
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleArticleInit(): void {
    this.data.onInitArticle(this.title);
    console.log('Commencer')
  }

  ngOnInit(): void {
  }

}