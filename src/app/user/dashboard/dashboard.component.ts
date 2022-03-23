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

  public isAdmin!: boolean;

  subscription2$!: Subscription;

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
    this.subscription2$ = this.articleService.findAllMyArticles(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedArticles)
  }

  public fetchAllArticlesAsAdmin(status: string) {
    this.loading = true;
    this.subscription2$ = this.articleService.findAllArticles(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedArticles)
  }

  public sortBy(tab: string): void {
    if (tab === 'published') {
      this.activePage = 'published';
      this.router.navigateByUrl('/user/dashboard');
      if (this.isAdmin) {
        this.fetchAllArticlesAsAdmin('published')
      } else {
        this.fetchMyArticlesByStatus('published');
      }
    }

    if (tab === 'draft') {
      this.activePage = 'draft'
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
      if (this.isAdmin) {
        this.fetchAllArticlesAsAdmin('draft')
      } else {
        this.fetchMyArticlesByStatus('draft');
      }
    }

    if (tab === 'in-review') {
      this.activePage = 'in-review'
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
      if (this.isAdmin) {
        this.fetchAllArticlesAsAdmin('in-review')
      } else {
        this.fetchMyArticlesByStatus('in-review');
      }
    }

    if (tab === 'all') {
      this.activePage = 'all'
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
    }

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  public onScroll() {
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

    const queryParamOne = this.route.snapshot.queryParamMap.get('sortBy')!;

    if (queryParamOne === 'draft') {
      console.log('FETCHING BY DRAFT');
      console.log('fetching...');

      if (this.isAdmin) {
        this.articleService.findAllArticles(this.scrollyPageNumber, this.pageItemsLimit, 'draft')
        return
      }

      this.articleService.findAllMyArticles(this.scrollyPageNumber, this.pageItemsLimit, 'draft')
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
      return
    }

    if (queryParamOne === 'in-review') {
      console.log('FETCHING BY IN-REVIEW');
      console.log('fetching...');

      if (this.isAdmin) {
        this.articleService.findAllArticles(this.scrollyPageNumber, this.pageItemsLimit, 'in-review')
        return
      }

      this.articleService.findAllMyArticles(this.scrollyPageNumber, this.pageItemsLimit, 'in-review')
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
      return
    }

    console.log('FETCHING BY DEFAULT (PUBLISHED)');
    console.log('fetching...');

    if (this.isAdmin) {
      this.articleService.findAllArticles(this.scrollyPageNumber, this.pageItemsLimit, 'published')
      return
    }

    this.articleService.findAllMyArticles(this.scrollyPageNumber, this.pageItemsLimit, 'published')
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
      this.articles = [];
      this.errorMessage = 'Oops...!'
    }
  }


  ngOnInit(): void {
    this.router.navigateByUrl('/user/dashboard');

    this.isAdmin = this.authService.currentUsr?.roles.some((role: string) => role === 'ROLE_ADMIN');
    console.log('IS ADMIN? : ', this.isAdmin);

    this.seo.generateTags({
      title: 'Mes articles | Zerofiltre.tech'
    });

    if (isPlatformBrowser(this.platformId)) {
      if (this.isAdmin) {
        this.fetchAllArticlesAsAdmin('published')
      } else {
        this.fetchMyArticlesByStatus('published');
      }
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription2$.unsubscribe()
    }
  }

}
