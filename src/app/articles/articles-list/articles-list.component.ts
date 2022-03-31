import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Article, Tag } from '../article.model';
import { ArticleService } from '../article.service';
import { MatDialog } from '@angular/material/dialog'
import { ArticleEntryPopupComponent } from '../article-entry-popup/article-entry-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { calcReadingTime } from 'src/app/services/utilities.service';
import { AuthService } from 'src/app/user/auth.service';
import { Subscription } from 'rxjs';

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

  public activePage: string = this.RECENT;
  public mainPage = true;

  subscription1$!: Subscription;
  subscription2$!: Subscription;

  constructor(
    private seo: SeoService,
    private articleService: ArticleService,
    private dialogRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  openArticleEntryDialog(): void {
    this.dialogRef.open(ArticleEntryPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      // backdropClass: 'article-popup-backdrop',
      data: {
        router: this.router
      }
    });
  }

  public fetchListOfTags(): void {
    this.loading = true;

    this.subscription1$ = this.articleService.getListOfTags().subscribe({
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

  public sortBy(trendName: string): void {
    this.articles = [];

    if (trendName === this.RECENT) {
      this.activePage = this.RECENT;
      this.fetchRecentArticles();
      this.router.navigateByUrl('/articles');
    }

    if (trendName === this.POPULAR) {
      this.activePage = this.POPULAR
      this.fetchPopularArticles();
      this.router.navigateByUrl(`?sortBy=${trendName}`);
    }

    if (trendName === this.TRENDING) {
      this.activePage = this.TRENDING
      this.fetchRecentArticles();
      this.router.navigateByUrl('/articles');
    }

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }


  public sortByTag(tagName: any): void {
    this.articles = [];

    this.fetchArticlesByTag(tagName);
    this.router.navigateByUrl(`?tag=${tagName}`)

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  public onScroll() {
    // Remove this.hasnext to enable end of list message
    if (this.notScrolly && this.notEmptyArticles && this.hasNext) {
      this.loadingMore = true;
      this.notScrolly = false;
      this.fetchMoreArticles();
    }
  }

  public fetchMoreArticles() {

    if (!this.hasNext) {
      this.loadingMore = false;
      this.notScrolly = true;
      this.notEmptyArticles = false;
      return
    }

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

      if (this.articles.length === 0) {
        this.errorMessage = "Aucun article à lire pour le moment 😊!"
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
    this.seo.generateTags({
      title: 'Tous les articles | Zerofiltre.tech',
      description: "Développez des Apps à valeur ajoutée pour votre business et pas que pour l'IT. Avec Zerofiltre, profitez d'offres taillées pour chaque entreprise. Industrialisez vos Apps. Maintenance, extension, supervision.",
      author: 'Zerofiltre.tech',
      type: 'website',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });

    this.router.navigateByUrl('/articles');

    if (isPlatformBrowser(this.platformId)) {
      this.fetchRecentArticles();
      this.fetchListOfTags()
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription1$.unsubscribe()
      this.subscription2$.unsubscribe()
    }
  }
}
