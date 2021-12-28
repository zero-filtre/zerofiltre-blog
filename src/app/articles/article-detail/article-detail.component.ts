import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
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
  public articleId!: number;
  public previousArticle!: Article;
  public nextArticle!: Article;
  readonly blogUrl = environment.blogUrl;

  constructor(private route: ActivatedRoute, private articleService: ArticleService, private seo: SeoService) { }

  public calcReadingTime(article: Article): void {
    const content = article?.content
    const wpm = 225;
    const words = content?.trim().split(/\s+/).length || 0;
    const time = Math.ceil(words / wpm);
    article.readingTime = time
  }

  public getCurrentArticle(articleId: number): void {
    this.articleService.getOneArticle(articleId)
      .pipe(
        tap(art => {
          this.seo.generateTags({
            title: art.title,
            description: art.title,
            image: art.thumbnail,
            author: art.author?.pseudoName,
            type: 'article'
          })
        })
      )
      .subscribe(
        (response: Article) => {
          this.article = response
          this.calcReadingTime(response)
        },

        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
  }

  public getPreviousArticle(articleId: number): void {
    this.articleService.getOneArticle(articleId).subscribe(
      (response: Article) => {
        this.previousArticle = response;
      },

      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  public setArticleData(state: string): void {
    if (state === 'next') this.articleId = +this.articleId + 1
    if (state === 'prev') this.articleId = +this.articleId - 1

    this.getCurrentArticle(this.articleId)
    this.getNextArticle(+this.articleId + 1)
    if (this.articleId > 1) this.getPreviousArticle(+this.articleId - 1)
  }

  public getNextArticle(articleId: number): void {
    this.articleService.getOneArticle(articleId).subscribe(
      (response: Article) => {
        this.nextArticle = response;
      },

      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id;
    this.getCurrentArticle(this.articleId);
    if (this.articleId > 1) this.getPreviousArticle(+this.articleId - 1);
    this.getNextArticle(+this.articleId + 1);
  }

}
