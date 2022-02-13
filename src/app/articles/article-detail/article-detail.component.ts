import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, pluck, filter, switchMap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { calcReadingTime, formatDate, objectExists } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

import "clipboard";
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/components/prism-markup";
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';

declare var Prism: any;

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit, AfterViewChecked, OnDestroy {
  public article!: Article;
  public articleId!: number;
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

  public getCurrentArticle(articleId: number): void {
    this.loading = true;
    this.articleService.getOneArticle(articleId)
      .pipe(
        filter(objectExists),
        tap(art => {
          this.seo.generateTags({
            title: art.title,
            description: art.title,
            image: art.thumbnail,
            author: art.author?.pseudoName,
            type: 'article'
          })
          if (art.status === 'PUBLISHED') {
            this.isPublished = true;
            console.log('PUBLISHED');
          } else {
            this.isPublished = false;
            console.log('NOT PUBLISHED');
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
          this.messageService.cancel();
        }
      })
    }
  }

  isAuthor(user: any, article: Article): boolean {
    return user?.sub === article?.author?.email || user?.email !== article?.author?.email
  }

  isSocialLinkPresent(platform: string): boolean {
    return this.article?.author?.socialLinks.some((link: any) => link.platform === platform)
  }

  authorPlatformLink(platform: string): string {
    return this.article?.author?.socialLinks.find((link: any) => link.platform === platform)?.link
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params.id;
    this.getCurrentArticle(this.articleId);
  }

  ngAfterViewChecked() {
    Prism.highlightAll();
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
