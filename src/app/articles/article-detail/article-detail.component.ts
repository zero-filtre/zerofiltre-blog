import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private seo: SeoService,
    private router: Router
  ) { }

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

  public fetchSiblingArticles(prev: number, next: number): void {
    this.articleService.getOneArticle(next).subscribe(
      (response: Article) => {
        this.nextArticle = response;
      },

      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    )

    if (prev !== 0) {
      this.articleService.getOneArticle(prev).subscribe(
        (response: Article) => {
          this.previousArticle = response;
        },

        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      )
    }
  }


  public goToArticle(position: string): void {
    if (position === 'prev') {
      // this.router.navigateByUrl(`articles/${this.previousArticle.id}`)
      this.router.navigate(['', `/${this.previousArticle.id}`])
    }

    if (position === 'next') {
      this.router.navigateByUrl(``)
    }
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id;
    this.getCurrentArticle(this.articleId);
    this.fetchSiblingArticles(+this.articleId - 1, +this.articleId + 1)
  }

}
