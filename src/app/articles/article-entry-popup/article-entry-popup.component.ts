import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-entry-popup',
  templateUrl: './article-entry-popup.component.html',
  styleUrls: ['./article-entry-popup.component.css']
})
export class ArticleEntryPopupComponent implements OnInit {
  public title!: string;
  public placeholder!: string
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ArticleEntryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private articleService: ArticleService,
  ) {
    this.title = '';
    this.placeholder = 'Tout commence par un titre!'
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleArticleInit(): void {
    this.loading = true;

    this.articleService.createArticle(this.title).subscribe({
      next: (_response: Article) => {
        this.data.router.navigateByUrl('articles/new');
        this.loading = false;
        this.dialogRef.close();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error.message);
      }
    })
  }

  ngOnInit(): void {
  }

}
