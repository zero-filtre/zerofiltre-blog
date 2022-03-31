import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { SeoService } from 'src/app/services/seo.service';
import { calcReadingTime } from 'src/app/services/utilities.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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

  subscription$!: Subscription;

  constructor(
    private seo: SeoService,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  public setArticlesReadingTime(articles: Article[]): void {
    for (const article of articles) {
      calcReadingTime(article);
    }
  }

  public fetchMyArticlesByStatus(status: string) {
    this.loading = true;
    this.subscription$ = this.articleService.findAllMyArticles(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedArticles)
  }

  public fetchAllArticlesAsAdmin(status: string) {
    this.loading = true;
    this.subscription$ = this.articleService.findAllArticles(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedArticles)
  }

  public sortBy(tab: string): void {
    this.articles = [];

    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.router.navigateByUrl('/user/dashboard');
      this.fetchMyArticlesByStatus(this.PUBLISHED);
    }

    if (tab === this.DRAFT) {
      this.activePage = this.DRAFT
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
      this.fetchMyArticlesByStatus(this.DRAFT);
    }

    if (tab === this.IN_REVIEW) {
      this.activePage = this.IN_REVIEW
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
      this.fetchMyArticlesByStatus(this.IN_REVIEW);
    }

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

  public fetchMoreArticles(): any {
    if (!this.hasNext) {
      this.loadingMore = false;
      this.notScrolly = true;
      this.notEmptyArticles = false;
      return
    }

    this.scrollyPageNumber += 1;

    const queryParam = this.route.snapshot.queryParamMap.get('sortBy')!;

    if (queryParam === this.DRAFT) {
      return this.articleService.findAllMyArticles(this.scrollyPageNumber, this.pageItemsLimit, this.DRAFT)
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
    }

    if (queryParam === 'in-review') {
      return this.articleService.findAllMyArticles(this.scrollyPageNumber, this.pageItemsLimit, this.IN_REVIEW)
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
    }

    this.articleService.findAllMyArticles(this.scrollyPageNumber, this.pageItemsLimit, this.PUBLISHED)
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
        this.errorMessage = "Aucun article trouvé 😊!"
      }
    },
    error: (_error: HttpErrorResponse) => {
      this.loading = false;
      this.hasNext = false;
      this.articles = [];
      this.errorMessage = 'Oops...!'
    }
  }


  ngOnInit(): void {
    this.router.navigateByUrl('/user/dashboard');

    this.seo.generateTags({
      title: 'Mes articles | Zerofiltre.tech'
    });

    if (isPlatformBrowser(this.platformId)) {
      this.fetchMyArticlesByStatus(this.PUBLISHED);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription$.unsubscribe()
    }
  }

}
