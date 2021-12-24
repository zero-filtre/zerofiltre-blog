import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  public article!: Article;
  public articleId!: string;
  public previousArticle!: Article;
  public nextArticle!: Article;
  readonly blogUrl = environment.blogUrl;

  constructor(private route: ActivatedRoute, private articleService: ArticleService) { }

  public getCurrentArticle(articleId: string): void {
    this.articleService.getOneArticle(articleId).subscribe(
      (response: Article) => {
        this.article = response;
      },

      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getPreviousArticle(articleId: string): void {
    this.articleService.getOneArticle(articleId).subscribe(
      (response: Article) => {
        this.previousArticle = response;
      },

      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public setArticleData(): void {
    this.article = this.nextArticle;
    console.log("CALLED")
  }

  public getNextArticle(articleId: string): void {
    this.articleService.getOneArticle(articleId).subscribe(
      (response: Article) => {
        this.nextArticle = response;
      },

      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id;
    this.getCurrentArticle(this.articleId);
    this.getPreviousArticle((+this.articleId - 1).toString());
    this.getNextArticle((+this.articleId + 1).toString());
  }

}
