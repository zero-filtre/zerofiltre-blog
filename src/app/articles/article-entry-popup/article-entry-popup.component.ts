import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';
import { SlugUrlPipe } from 'src/app/shared/pipes/slug-url.pipe';

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
    private loadEnvService: LoadEnvService,
    public dialogRef: MatDialogRef<ArticleEntryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private articleService: ArticleService,
    private slugify: SlugUrlPipe
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
        this.data.router.navigateByUrl(`articles/${this.slugify.transform(this.article)}/edit`);
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
