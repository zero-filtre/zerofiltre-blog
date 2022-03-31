import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, filter } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { calcReadingTime, formatDate, objectExists } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';
import { Article, Tag } from '../article.model';
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
  private isPublished = new BehaviorSubject<any>(null);
  public isPublished$ = this.isPublished.asObservable();
  readonly blogUrl = environment.blogUrl;

  private nberOfReactions = new BehaviorSubject<number>(0);
  public nberOfReactions$ = this.nberOfReactions.asObservable();
  public typesOfReactions = ['clap', 'fire', 'love', 'like'];

  private fireReactions = new BehaviorSubject<number>(0);
  public fireReactions$ = this.fireReactions.asObservable();
  private clapReactions = new BehaviorSubject<number>(0);
  public clapReactions$ = this.clapReactions.asObservable();
  private loveReactions = new BehaviorSubject<number>(0);
  public loveReactions$ = this.loveReactions.asObservable();
  private likeReactions = new BehaviorSubject<number>(0);
  public likeReactions$ = this.likeReactions.asObservable();

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
            title: this.article?.title,
            description: this.article?.summary,
            image: this.article?.thumbnail,
            author: this.article?.author?.fullName,
            type: 'article'
          })

          this.nberOfReactions.next(response?.reactions?.length);
          this.fireReactions.next(this.findTotalReactionByAction('FIRE', response?.reactions));
          this.clapReactions.next(this.findTotalReactionByAction('CLAP', response?.reactions));
          this.loveReactions.next(this.findTotalReactionByAction('LOVE', response?.reactions));
          this.likeReactions.next(this.findTotalReactionByAction('LIKE', response?.reactions));

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
    return this.article?.author?.socialLinks.some((profile: any) => profile.platform === platform && profile.link)
  }

  authorPlatformLink(platform: string): string {
    return this.article?.author?.socialLinks.find((profile: any) => profile.platform === platform)?.link
  }

  userHasAlreadyReactOnArticleFiftyTimes(): any {
    const artileReactions = this.article?.reactions;
    const currentUsr = this.authService?.currentUsr;
    return artileReactions.filter((reaction: any) => reaction?.authorId === currentUsr?.id).length === 49;
  }

  findTotalReactionByAction(action: string, reactions: []): number {
    return reactions.filter((reaction: any) => reaction.action === action).length;
  }

  areRelated(a: Article, b: Article): boolean {
    const tagsA = a.tags;
    const tagsB = b.tags;

    return tagsA.some((tag: Tag) => tagsB.some((item: Tag) => item.name === tag.name));
  }

  addReaction(action: string): any {
    const currentUsr = this.authService?.currentUsr;

    if (this.userHasAlreadyReactOnArticleFiftyTimes()) {
      if (!this.loginToAddReactionMessage) return this.loginToAddReactionMessage = 'Tu as déja atteint le max de reactions sur cet article 😁'
      return this.loginToAddReactionMessage = '';
    };

    if (!currentUsr) {
      if (!this.loginToAddReactionMessage) return this.loginToAddReactionMessage = 'Vous devez vous connecter pour réagir sur cet article'
      return this.loginToAddReactionMessage = '';
    }

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

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.articleId = params.get('id')!;

        this.getCurrentArticle(this.articleId);

        // TODO: add server APi transfert state to prevent double request
        // if (isPlatformBrowser(this.platformId)) {
        // }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
