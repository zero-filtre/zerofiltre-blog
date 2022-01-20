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
      .subscribe({
        next: (response: Article) => {
          this.article = response
          this.calcReadingTime(response)
          this.fetchArticleSiblings(+this.articleId - 1, +this.articleId + 1)
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
          this.router.navigateByUrl('/')
        }
      })
  }

  public fetchArticleSiblings(prev: number, next: number): void {
    this.articleService.getOneArticle(next).subscribe({
      next: (response: Article) => {
        this.nextArticle = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    })

    if (prev !== 0) {
      this.articleService.getOneArticle(prev).subscribe({
        next: (response: Article) => {
          this.previousArticle = response;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      })
    }
  }

  isSocialLinkPresent(platform: string): boolean {
    return this.article?.author?.socialLinks.some((link: any) => link.platform === platform)
  }

  authorPlatformLink(platform: string): string {
    return this.article?.author?.socialLinks.find((link: any) => link.platform === platform).link
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id;
    this.getCurrentArticle(this.articleId);
  }

}
