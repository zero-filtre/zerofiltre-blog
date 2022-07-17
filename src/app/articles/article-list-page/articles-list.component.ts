import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Article, Tag } from '../article.model';
import { ArticleService } from '../article.service';
import { MatDialog } from '@angular/material/dialog'
import { ArticleEntryPopupComponent } from '../article-entry-popup/article-entry-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { calcReadingTime, capitalizeString, nFormatter } from 'src/app/services/utilities.service';
import { AuthService } from 'src/app/user/auth.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DeleteArticlePopupComponent } from '../delete-article-popup/delete-article-popup.component';
import { LoadEnvService } from 'src/app/services/load-env.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  public articles!: Article[];
  public tagList!: Tag[];

  RECENT = 'recent';
  POPULAR = 'popular';
  TRENDING = 'trending';
  TAGS = 'tags';

  // dddSponsorContentSourceUrl = 'assets/images/Frame DDD (2).svg';
  dddSponsorContentSourceUrl = 'assets/images/ddd-imagee.svg'

  public notEmptyArticles = true;
  public notScrolly = true;
  public lastPage!: number;
  public loadingMore = false;
  public hasNext!: boolean;
  public scrollyPageNumber = 0;

  public pageNumber: number = 0;
  public pageItemsLimit: number = 5;

  public loading = false;
  public noArticlesAvailable!: boolean;
  public loadArticlesErrorMessage!: boolean;

  public activePage: string = this.RECENT;
  public mainPage = true;
  public openedTagsDropdown = false;
  public activeTag!: string;


  public tags$!: Subscription;
  public articles$!: Subscription;
  status!: string;
  tag!: string;

  constructor(
    private loadEnvService: LoadEnvService,
    private seo: SeoService,
    private articleService: ArticleService,
    private dialogEntryRef: MatDialog,
    private dialogDeleteRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  openArticleEntryDialog(): void {
    this.dialogEntryRef.open(ArticleEntryPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        router: this.router
      }
    });
  }

  public isAuthor(user: any, article: Article): boolean {
    return user?.id === article?.author?.id
  }

  public openArticleDeleteDialog(articleId: number | undefined): void {
    this.dialogDeleteRef.open(DeleteArticlePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: articleId,
        history: this.router.url
      }
    });
  }

  public fetchListOfTags(): void {
    this.loading = true;
    this.tags$ = this.articleService
      .getListOfTags()
      .subscribe({
        next: (response: Tag[]) => {
          this.tagList = response
          this.loading = false;
        },
        error: (_error: HttpErrorResponse) => {
          this.loading = false;
        }
      })
  }

  public fetchRecentArticles(): void {
    this.loading = true;
    this.articles$ = this.articleService
      .findAllRecentArticles(this.pageNumber, this.pageItemsLimit)
      .subscribe(this.handleFetchedArticles)
  }

  public fetchPopularArticles(): void {
    this.loading = true;
    this.articles$ = this.articleService
      .findAllArticlesByPopularity(this.pageNumber, this.pageItemsLimit)
      .subscribe(this.handleFetchedArticles)
  }

  public fetchArticlesByTag(tagName: string): void {
    this.loading = true;
    this.articles$ = this.articleService
      .findAllArticlesByTag(this.pageNumber, this.pageItemsLimit, tagName)
      .subscribe(this.handleFetchedArticles)
  }

  public setArticlesReadingTime(articles: Article[]): void {
    for (const article of articles) {
      calcReadingTime(article);
    }
  }

  public sortBy(trendName: string): void {
    // this.articles = [];
    this.activeTag = '';

    if (trendName === this.RECENT) {
      this.activePage = this.RECENT;
      this.router.navigateByUrl('/articles');
    }

    if (trendName === this.POPULAR) {
      this.activePage = this.POPULAR
      this.router.navigateByUrl(`/articles?sortBy=${trendName}`);
    }

    if (trendName === this.TRENDING) {
      this.activePage = this.TRENDING
      this.router.navigateByUrl('/articles');
    }

    if (trendName === this.TAGS) {
      this.activePage = this.TAGS
      this.openedTagsDropdown = !this.openedTagsDropdown;
    } else {
      this.openedTagsDropdown = false;
    }

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }


  public sortByTag(tagName: any): void {
    this.openedTagsDropdown = false;
    this.activeTag = tagName;

    this.router.navigateByUrl(`/articles?tag=${tagName}`)

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  public onScroll() {

    if (this.notScrolly && this.notEmptyArticles && this.hasNext) {

      this.loadingMore = true;
      this.notScrolly = false;
      this.fetchMoreArticles();
    }
  }

  public fetchMoreArticles() {
    this.scrollyPageNumber += 1;
    const queryParamOne = this.route.snapshot.queryParamMap.get('sortBy')!;
    const queryParamTwo = this.route.snapshot.queryParamMap.get('tag')!;

    if (queryParamOne === this.POPULAR) {
      this.articleService.findAllArticlesByPopularity(this.scrollyPageNumber, this.pageItemsLimit)
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
      return
    }

    if (queryParamTwo) {
      this.articleService.findAllArticlesByTag(this.scrollyPageNumber, this.pageItemsLimit, queryParamTwo)
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
      return
    }

    this.articleService.findAllRecentArticles(this.scrollyPageNumber, this.pageItemsLimit)
      .subscribe((response: any) => this.handleNewFetchedArticles(response));

  }

  private handleNewFetchedArticles({ content, hasNext }: any) {
    const newArticles = content;
    this.loadingMore = false;
    this.hasNext = hasNext;
    this.setArticlesReadingTime(newArticles);

    if (newArticles.length === 0) {
      this.notEmptyArticles = false;
    }

    this.articles = this.articles.concat(newArticles);
    this.notScrolly = true;
  }

  private handleFetchedArticles = {
    next: ({ content, hasNext }: any) => {
      this.articles = content;
      this.setArticlesReadingTime(this.articles);
      this.loading = false;
      this.hasNext = hasNext;
      this.noArticlesAvailable = false;

      if (this.articles.length === 0) {
        this.noArticlesAvailable = true;
      }
    },
    error: (_error: HttpErrorResponse) => {
      this.loading = false;
      this.hasNext = false;
      this.articles = [];
      this.loadArticlesErrorMessage = true;
    }
  }

  public nFormater(totalReactions: number): string {
    return nFormatter(totalReactions)
  }

  public capitalize(str: string): string {
    return capitalizeString(str);
  }


  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.fetchListOfTags()

      this.route.queryParamMap.subscribe(
        query => {
          this.status = query.get('sortBy')!;
          this.tag = query.get('tag')!;

          if (this.tag) {
            // this.activePage = this.TAGS;
            return this.fetchArticlesByTag(this.tag);
          }

          if (!this.status) {
            this.activePage ||= this.RECENT;
            return this.fetchRecentArticles();
          }

          if (this.status == this.POPULAR) {
            this.activePage = this.status;
            return this.fetchPopularArticles();
          }
        }
      );
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.articlesTitle'),
      description: this.translate.instant('meta.articlesDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.tags$.unsubscribe()
      this.articles$.unsubscribe()
    }
  }
}
