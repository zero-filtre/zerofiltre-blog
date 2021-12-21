import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id;
    this.getCurrentArticle(this.articleId);
  }

}
