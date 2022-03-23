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

  public activePage = 'published';
  public mainPage = true;

  subscription2$!: Subscription;

  constructor(
    private seo: SeoService,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }


  public fetchRecentArticles(): void {
    this.loading = true;

    this.subscription2$ = this.articleService.findAllRecentArticles(this.pageNumber, this.pageItemsLimit)
      .subscribe(this.handleFetchedArticles)
  }

  public fetchPopularArticles(): void {
    this.loading = true;

    this.subscription2$ = this.articleService.findAllArticlesByPopularity(this.pageNumber, this.pageItemsLimit)
      .subscribe(this.handleFetchedArticles)
  }

  public fetchArticlesByTag(tagName: string): void {
    this.loading = true;

    this.subscription2$ = this.articleService.findAllArticlesByTag(this.pageNumber, this.pageItemsLimit, tagName)
      .subscribe(this.handleFetchedArticles)
  }

  public setArticlesReadingTime(articles: Article[]): void {
    for (const article of articles) {
      calcReadingTime(article);
    }
  }

  public sortBy(tab: string): void {
    if (tab === 'published') {
      this.activePage = 'published';
      this.fetchRecentArticles();
      this.router.navigateByUrl('/user/dashboard');
    }

    if (tab === 'draft') {
      this.activePage = 'draft'
      this.fetchPopularArticles();
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
    }

    if (tab === 'in-review') {
      this.activePage = 'in-review'
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
    }

    if (tab === 'all') {
      this.activePage = 'all'
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
    }

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  public onScroll() {
    // Remove this.hasnext to enable end of list message
    if (this.notScrolly && this.notEmptyArticles && this.hasNext) {
      console.log('scrolled!!');

      this.loadingMore = true;
      this.notScrolly = false;
      this.fetchMoreArticles();
    }
  }

  public fetchMoreArticles() {

    if (!this.hasNext) {
      console.log('END OF THE LIST !');

      this.loadingMore = false;
      this.notScrolly = true;
      this.notEmptyArticles = false;
      return
    }

    this.scrollyPageNumber += 1;
    console.log('PAGE NUMBER: ', this.scrollyPageNumber);

    const queryParamOne = this.route.snapshot.queryParamMap.get('sortBy')!;
    const queryParamTwo = this.route.snapshot.queryParamMap.get('tag')!;

    if (queryParamOne === 'popular') {
      console.log('FETCHING BY POPULAR');
      console.log('fetching...');
      this.articleService.findAllArticlesByPopularity(this.scrollyPageNumber, this.pageItemsLimit)
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
      return
    }

    if (queryParamTwo) {
      console.log('FETCHING BY TAGS');
      console.log('fetching...');
      this.articleService.findAllArticlesByTag(this.scrollyPageNumber, this.pageItemsLimit, queryParamTwo)
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
      return
    }

    console.log('FETCHING BY DEFAULT (RECENT)');
    console.log('fetching...');
    this.articleService.findAllRecentArticles(this.scrollyPageNumber, this.pageItemsLimit)
      .subscribe((response: any) => this.handleNewFetchedArticles(response));

  }

  private handleNewFetchedArticles({ content, hasNext }: any) {
    const newArticles = content;
    this.loadingMore = false;
    this.hasNext = hasNext;

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
        this.errorMessage = "Aucun article à lire pour le moment 😊!"
      }
    },
    error: (_error: HttpErrorResponse) => {
      this.loading = false;
      this.errorMessage = 'Oops...!'
    }
  }


  ngOnInit(): void {
    console.log('URL: ', this.router.url);

    this.router.navigateByUrl('/user/dashboard');

    this.seo.generateTags({
      title: 'Mes les articles | Zerofiltre.tech'
    });

    if (isPlatformBrowser(this.platformId)) {
      this.fetchRecentArticles();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription2$.unsubscribe()
    }
  }

}
