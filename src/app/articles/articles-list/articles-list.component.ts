import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Article, Tag } from '../article.model';
import { ArticleService } from '../article.service';
import { MatDialog } from '@angular/material/dialog'
import { ArticleEntryPopupComponent } from '../article-entry-popup/article-entry-popup.component';
import { Router } from '@angular/router';
import { isPlatformBrowser, Location } from '@angular/common';
import { calcReadingTime, formatDate } from 'src/app/services/utilities.service';
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

  public pageNumber: number = 0;
  public pageItemsLimit: number = 5;

  public loading: boolean = false;
  public errorMessage: string = '';

  public activePage: string = 'recent';
  public mainPage = true;

  subscription1$!: Subscription;
  subscription2$!: Subscription;

  constructor(
    private seo: SeoService,
    private articleService: ArticleService,
    private dialogRef: MatDialog,
    private router: Router,
    private location: Location,
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
        const platform = isPlatformBrowser(this.platformId) ?
          'in the browser' : 'on the server';
        console.log(`getListOfTags : Running ${platform}`);

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

    this.subscription2$ = this.articleService.findAllRecentArticles(this.pageNumber, this.pageItemsLimit).subscribe({
      next: (response: Article[]) => {
        const platform = isPlatformBrowser(this.platformId) ?
          'in the browser' : 'on the server';
        console.log(`fetchRecentArticles : Running ${platform}`);

        this.articles = response;
        this.setArticlesReadingTime(response);
        this.loading = false;

        if (response.length === 0) {
          this.errorMessage = "Aucun article à lire pour le moment !"
        }
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = 'Oops...!'
      }
    })
  }

  public fetchPopularArticles(): void {
    this.loading = true;

    this.subscription2$ = this.articleService.findAllArticlesByPopularity(this.pageNumber, this.pageItemsLimit).subscribe({
      next: (response: Article[]) => {
        const platform = isPlatformBrowser(this.platformId) ?
          'in the browser' : 'on the server';
        console.log(`fetchPopularArticles : Running ${platform}`);

        this.articles = response;
        this.setArticlesReadingTime(response);
        this.loading = false;

        if (response.length === 0) {
          this.errorMessage = "Aucun article à lire pour le moment !"
        }
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = 'Oops...!'
      }
    })
  }

  public fetchArticlesByTag(tagName: string): void {
    this.loading = true;

    this.subscription2$ = this.articleService.findAllArticlesByTag(this.pageNumber, this.pageItemsLimit, tagName).subscribe({
      next: (response: Article[]) => {
        const platform = isPlatformBrowser(this.platformId) ?
          'in the browser' : 'on the server';
        console.log(`fetchArticlesByTag : Running ${platform}`);

        this.articles = response;
        this.setArticlesReadingTime(response);
        this.loading = false;

        if (response.length === 0) {
          this.errorMessage = "Aucun article à lire pour le moment !"
        }
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = 'Oops...!'
      }
    })
  }

  public setArticlesReadingTime(articles: Article[]): void {
    for (const article of articles) {
      calcReadingTime(article);
    }
  }

  public sortBy(trendName: string): void {

    if (trendName === 'recent') {
      this.activePage = 'recent';
      this.fetchRecentArticles();
      this.location.go(this.router.url)
    }

    if (trendName === 'popular') {
      this.activePage = 'popular'
      this.fetchPopularArticles();
      this.location.go(`${this.router.url}?sortBy=${trendName}`)
    }

    if (trendName === 'trending') {
      this.activePage = 'trending'
      this.location.go(`${this.router.url}?sortBy=${trendName}`)
    }
  }


  public sortByTag(tagName: any): void {
    this.fetchArticlesByTag(tagName);
    // this.location.go(`${this.router.url}?tag=${tagName}`)
  }

  public searchArticles(key: string): void {
    const results: Article[] = []

    for (const article of this.articles) {
      if (
        article.title?.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        article.tags?.some(tag => tag.name?.toLowerCase().indexOf(key.toLowerCase()) !== -1) ||
        article.author?.fullName?.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(article)
      }

      this.articles = results

      if (results.length === 0 || !key) {
        this.fetchRecentArticles();
      }
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

    this.location.go('/articles');

    if (isPlatformBrowser(this.platformId)) {
      this.fetchRecentArticles();
      this.fetchListOfTags()
    }

    console.log('RENDERING LIST COMPONENT');
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription1$.unsubscribe()
      this.subscription2$.unsubscribe()
    }
  }
}
