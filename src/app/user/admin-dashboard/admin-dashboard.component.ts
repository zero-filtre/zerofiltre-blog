import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SeoService } from 'src/app/services/seo.service';
import {
  calcReadingTime,
  nFormatter,
} from 'src/app/services/utilities.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  public articles!: Article[];

  PUBLISHED = 'published';
  DRAFT = 'draft';
  IN_REVIEW = 'in_review';

  public notEmptyArticles = true;
  public notScrolly = true;
  public lastPage!: number;
  public loadingMore = false;
  public hasNext!: boolean;
  public scrollyPageNumber = 0;

  public pageNumber: number = 0;
  public pageItemsLimit: number = 5;

  public loading = false;
  public errorMessage = '';

  public activePage: string = this.PUBLISHED;
  public mainPage = true;

  public subscription$!: Subscription;

  constructor(
    private seo: SeoService,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private translate: TranslateService,
    public navigate: NavigationService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  public setArticlesReadingTime(articles: Article[]): void {
    for (const article of articles) {
      calcReadingTime(article);
    }
  }

  public fetchAllArticlesAsAdmin(status: string) {
    this.loading = true;
    this.subscription$ = this.articleService
      .findAllArticles(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedArticles);
  }

  public sortBy(tab: string): void {
    this.articles = [];

    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.router.navigateByUrl('/user/dashboard/admin');
      this.fetchAllArticlesAsAdmin(this.PUBLISHED);
    }

    if (tab === this.DRAFT) {
      this.activePage = this.DRAFT;
      this.router.navigateByUrl(`/user/dashboard/admin?sortBy=${tab}`);
      this.fetchAllArticlesAsAdmin(this.DRAFT);
    }

    if (tab === this.IN_REVIEW) {
      this.activePage = this.IN_REVIEW;
      this.router.navigateByUrl(`/user/dashboard/admin?sortBy=${tab}`);
      this.fetchAllArticlesAsAdmin(this.IN_REVIEW);
    }

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  public onScroll() {
    console.log('Normal Scroll...!');

    if (this.notScrolly && this.notEmptyArticles && this.hasNext) {
      console.log('HasMore Scroll...!');
      this.loadingMore = true;
      this.notScrolly = false;
      this.fetchMoreArticles();
    }
  }

  public fetchMoreArticles(): any {
    if (!this.hasNext) {
      this.loadingMore = false;
      this.notScrolly = true;
      this.notEmptyArticles = false;
      return;
    }

    this.scrollyPageNumber += 1;

    const queryParam = this.route.snapshot.queryParamMap.get('sortBy')!;

    if (queryParam === this.DRAFT) {
      return this.articleService
        .findAllArticles(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.DRAFT
        )
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
    }

    if (queryParam === this.IN_REVIEW) {
      return this.articleService
        .findAllArticles(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.IN_REVIEW
        )
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
    }

    this.articleService
      .findAllArticles(
        this.scrollyPageNumber,
        this.pageItemsLimit,
        this.PUBLISHED
      )
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

      if (this.articles.length === 0) {
        this.errorMessage = 'Aucun article trouvé 😊!';
      }
    },
    error: (_error: HttpErrorResponse) => {
      this.loading = false;
      this.hasNext = false;
      this.articles = [];
      this.errorMessage = 'Oops...!';
    },
  };

  public nFormater(totalReactions: number): string {
    return nFormatter(totalReactions);
  }

  ngOnInit(): void {
    this.router.navigateByUrl('/user/dashboard/admin');

    this.seo.generateTags({
      title: this.translate.instant('meta.adminDashboadTitle'),
      description: this.translate.instant('meta.adminDashboadDescription'),
    });

    if (isPlatformBrowser(this.platformId)) {
      this.fetchAllArticlesAsAdmin(this.PUBLISHED);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription$.unsubscribe();
    }
  }
}