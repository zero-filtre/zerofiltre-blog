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
  public loading: boolean = false;
  public article!: Article

  constructor(
    public dialogRef: MatDialogRef<ArticleEntryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private articleService: ArticleService,
  ) {
    this.title = '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleArticleInit(): void {
    if (!this.title.trim()) return;

    this.loading = true;

    this.articleService.createArticle(this.title).subscribe({
      next: (response: Article) => {
        this.article = response;
        this.data.router.navigateByUrl(`articles/${this.article.id}/edit`);
        this.loading = false;
        this.dialogRef.close();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.dialogRef.close();
      }
    })
  }

  ngOnInit(): void {
  }

}
