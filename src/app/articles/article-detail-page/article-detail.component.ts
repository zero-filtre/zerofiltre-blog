import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { calcReadingTime, capitalizeString, formatDate } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteArticlePopupComponent } from '../delete-article-popup/delete-article-popup.component';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  public article!: Article;
  public articleId!: string;
  public similarArticles!: Article[];
  public articleHasTags!: boolean;
  public loading!: boolean;
  private isPublished = new BehaviorSubject<any>(null);
  public isPublished$ = this.isPublished.asObservable();
  readonly blogUrl = environment.blogUrl;

  private nberOfReactions = new BehaviorSubject<number>(0);
  public nberOfReactions$ = this.nberOfReactions.asObservable();
  public typesOfReactions = <any>[
    { action: 'clap', emoji: '👏' },
    { action: 'fire', emoji: '🔥' },
    { action: 'love', emoji: '💖' },
    { action: 'like', emoji: '👍' },
  ];

  private fireReactions = new BehaviorSubject<number>(0);
  public fireReactions$ = this.fireReactions.asObservable();
  private clapReactions = new BehaviorSubject<number>(0);
  public clapReactions$ = this.clapReactions.asObservable();
  private loveReactions = new BehaviorSubject<number>(0);
  public loveReactions$ = this.loveReactions.asObservable();
  private likeReactions = new BehaviorSubject<number>(0);
  public likeReactions$ = this.likeReactions.asObservable();

  public articleSub!: Subscription;
  public loginToAddReaction!: boolean;
  public maxNberOfReaction!: boolean;
  public hasHistory: boolean;

  dddSponsorContentSourceUrl = 'assets/images/ddd-imagee.svg';

  constructor(
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private seo: SeoService,
    private router: Router,
    public authService: AuthService,
    public messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.hasHistory = this.router.navigated;
  }

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
        tap(art => {
          if (art.status === 'PUBLISHED') {
            this.isPublished.next(true);
          } else {
            this.isPublished.next(false);
          }
        })
      )
      .subscribe({
        next: (response: Article) => {
          this.article = response

          this.seo.generateTags({
            title: response.title,
            description: response.summary,
            image: response.thumbnail,
            author: response.author?.fullName,
          })

          this.nberOfReactions.next(response?.reactions?.length);
          this.fireReactions.next(this.findTotalReactionByAction('FIRE', response?.reactions));
          this.clapReactions.next(this.findTotalReactionByAction('CLAP', response?.reactions));
          this.loveReactions.next(this.findTotalReactionByAction('LOVE', response?.reactions));
          this.likeReactions.next(this.findTotalReactionByAction('LIKE', response?.reactions));

          this.articleHasTags = response?.tags.length > 0
          calcReadingTime(response);
          this.fetchSimilarArticles();
          this.loading = false;
        },
        error: (_error: HttpErrorResponse) => {
          this.loading = false;
          this.messageService.openSnackBarError("Oops cet article est n'existe pas 😣!", '');
          this.router.navigateByUrl('/articles');
        }
      })
  }

  public fetchSimilarArticles(): void {
    if (!this.article?.tags.length) return

    const randomTagIndex = Math.floor(Math.random() * this.article?.tags.length);
    const randomTagName = this.article?.tags[randomTagIndex]?.name!

    this.articleService.findAllArticlesByTag(0, 20, randomTagName)
      .subscribe({
        next: ({ content }: any) => {
          const selectedArticles = []

          const filteredArticles = content
            .filter((article: Article) => article.id !== this.article.id)

          if (filteredArticles.length) {
            const randomArticleIndex = Math.floor(Math.random() * filteredArticles.length);
            selectedArticles.push(filteredArticles[randomArticleIndex])

            const newRandomArticleIndex = Math.floor(Math.random() * filteredArticles.length);
            if (newRandomArticleIndex !== randomArticleIndex) {
              selectedArticles.push(filteredArticles[newRandomArticleIndex])
            }
          }

          this.similarArticles = [...selectedArticles];
        }
      })
  }

  public isAuthor(user: any, article: Article): boolean {
    return user?.id === article?.author?.id
  }

  public authorHasSocials(): boolean {
    return this.article?.author?.socialLinks.length > 0
  }

  public authorHasSocialLinkFor(platform: string): boolean {
    return this.article?.author?.socialLinks.some((profile: any) => profile.platform === platform && profile.link)
  }

  public authorPlatformLink(platform: string): string {
    return this.article?.author?.socialLinks.find((profile: any) => profile.platform === platform)?.link
  }

  public userHasAlreadyReactOnArticleFiftyTimes(): boolean {
    const artileReactions = this.article?.reactions;
    const currentUsr = this.authService?.currentUsr;
    return artileReactions.filter((reaction: any) => reaction?.authorId === currentUsr?.id).length === 49;
  }

  public findTotalReactionByAction(action: string, reactions: []): number {
    return reactions.filter((reaction: any) => reaction.action === action).length;
  }

  public addReaction(action: string): any {
    const currentUsr = this.authService?.currentUsr;

    if (!currentUsr) {
      return this.loginToAddReaction = true;
    }
    if (this.userHasAlreadyReactOnArticleFiftyTimes()) {
      return this.maxNberOfReaction = true;
    };

    this.articleService.addReactionToAnArticle(this.articleId, action).subscribe({
      next: (response) => {
        this.nberOfReactions.next(response.length);
        this.fireReactions.next(this.findTotalReactionByAction('FIRE', response));
        this.clapReactions.next(this.findTotalReactionByAction('CLAP', response));
        this.loveReactions.next(this.findTotalReactionByAction('LOVE', response));
        this.likeReactions.next(this.findTotalReactionByAction('LIKE', response));
      }
    });
  }

  public openArticleDeleteDialog(): void {
    this.dialogRef.open(DeleteArticlePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: this.articleId,
        hasHistory: this.hasHistory
      }
    });
  }

  public capitalize(str: string): string {
    return capitalizeString(str);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.articleId = params.get('id')!;
        this.getCurrentArticle(this.articleId);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
