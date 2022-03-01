import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, filter } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { calcReadingTime, formatDate, objectExists } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  public article!: Article;
  public articleId!: string;
  public previousArticle!: Article;
  public nextArticle!: Article;
  public articleHasTags!: boolean;
  public loading: boolean = false;
  public isPublished!: boolean;
  readonly blogUrl = environment.blogUrl;

  public articleSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private seo: SeoService,
    private router: Router,
    private messageService: MessageService,
    public authService: AuthService
  ) { }

  public setDateFormat(date: any) {
    return formatDate(date)
  }

  public trimAuthorName(name: string | any) {
    return name?.replace(/ /g, '');
  }

  public getCurrentArticle(articleId: number): void {
    this.loading = true;
    this.articleService.getOneArticle(articleId)
      .pipe(
        filter(objectExists),
        tap(art => {
          this.seo.generateTags({
            title: art.title,
            description: art.summary,
            image: art.thumbnail,
            author: art.author?.fullName,
            type: 'article'
          })
          if (art.status === 'PUBLISHED') {
            this.isPublished = true;
          } else {
            this.isPublished = false;
          }
        })
      )
      .subscribe({
        next: (response: Article) => {
          this.article = response
          this.articleHasTags = response.tags.length > 0
          calcReadingTime(response);
          this.fetchArticleSiblings(+this.articleId - 1, +this.articleId + 1)
          this.loading = false;
        },
        error: (_error: HttpErrorResponse) => {
          this.loading = false;
          this.router.navigate(['/'])
        }
      })
  }

  public fetchArticleSiblings(prev: number, next: number): void {
    this.articleSub = this.articleService.getOneArticle(next).pipe(
      filter(objectExists)
    ).subscribe({
      next: (response: Article) => {
        this.nextArticle = response;
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.nextArticle = null!;
        this.messageService.cancel();
      }
    })

    if (prev !== 0) {
      this.articleService.getOneArticle(prev).pipe(
        filter(objectExists)
      ).subscribe({
        next: (response: Article) => {
          this.previousArticle = response;
        },
        error: (_error: HttpErrorResponse) => {
          this.loading = false;
          this.previousArticle = null!;
          this.messageService.cancel();
        }
      })
    }
  }

  isAuthor(user: any, article: Article): boolean {
    return user?.id === article?.author?.id
  }

  isSocialLinkPresent(platform: string): boolean {
    return this.article?.author?.socialLinks.some((link: any) => link.platform === platform)
  }

  authorPlatformLink(platform: string): string {
    return this.article?.author?.socialLinks.find((link: any) => link.platform === platform)?.link
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.articleId = params.get('id')!;
        this.getCurrentArticle(+this.articleId);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
