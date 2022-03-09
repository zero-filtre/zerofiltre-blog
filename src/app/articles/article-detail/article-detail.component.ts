import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, filter } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { calcReadingTime, formatDate, objectExists } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

import { MessageService } from 'src/app/services/message.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';
import { isPlatformBrowser } from '@angular/common';

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

  private nberOfReactions = new BehaviorSubject<number>(0);
  public nberOfReactions$ = this.nberOfReactions.asObservable();

  public articleSub!: Subscription;
  public loginToAddReactionMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private seo: SeoService,
    private router: Router,
    private messageService: MessageService,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  public setDateFormat(date: any) {
    return formatDate(date)
  }

  public trimAuthorName(name: string | any) {
    return name?.replace(/ /g, '');
  }

  public getCurrentArticle(articleId: string): void {
    this.loading = true;
    this.articleService.findArticleById(articleId)
      .pipe(
        filter(objectExists),
        tap(art => {
          this.seo.generateTags({
            title: art?.title,
            description: art?.summary,
            image: art?.thumbnail,
            author: art?.author?.fullName,
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
          const platform = isPlatformBrowser(this.platformId) ?
            'in the browser' : 'on the server';
          console.log(`findArticleById : Running ${platform}`);

          this.article = response
          this.nberOfReactions.next(response.reactions?.length);
          this.articleHasTags = response?.tags.length > 0
          calcReadingTime(response);
          this.fetchArticleSiblings(+this.articleId - 1, +this.articleId + 1)
          this.loading = false;
        },
        error: (_error: HttpErrorResponse) => {
          this.loading = false;
          this.router.navigateByUrl('/');
        }
      })
  }

  // TODO: implementer une liste d'articles similaires(limit: 5) (collectés par tags) a la place des siblings
  public fetchArticleSiblings(prev: number, next: number): void {
    this.articleSub = this.articleService.findArticleById(next.toString()).pipe(
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
      this.articleService.findArticleById(prev.toString()).pipe(
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

  authorHasSocialLinkFor(platform: string): boolean {
    return this.article?.author?.socialLinks.some((link: any) => link.platform === platform)
  }

  authorPlatformLink(platform: string): string {
    return this.article?.author?.socialLinks.find((link: any) => link.platform === platform)?.link
  }

  userHasAlreadyLikedArticle(): boolean {
    const artileReactions = this.article?.reactions;
    const currentUsr = this.authService?.currentUsr;
    return artileReactions.some((reaction: any) => reaction?.authorId === currentUsr?.id)
  }

  addReaction(): any {
    const currentUsr = this.authService?.currentUsr;
    if (this.userHasAlreadyLikedArticle()) return;

    if (!currentUsr) {
      if (!this.loginToAddReactionMessage) return this.loginToAddReactionMessage = 'Vous devez vous connectez pour réagir sur cet article'
      return this.loginToAddReactionMessage = '';
    }

    this.articleService.addReactionToAnArticle(this.articleId).subscribe({
      next: (response) => this.nberOfReactions.next(response.length)
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.articleId = params.get('id')!;

        if (isPlatformBrowser(this.platformId)) {
          this.getCurrentArticle(this.articleId);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
