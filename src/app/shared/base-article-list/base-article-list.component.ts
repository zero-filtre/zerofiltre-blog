import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { DeleteArticlePopupComponent } from 'src/app/articles/delete-article-popup/delete-article-popup.component';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { calcReadingTime, capitalizeString, nFormatter } from '../../services/utilities.service';
import { ArticleEntryPopupComponent } from '../../articles/article-entry-popup/article-entry-popup.component';

@Component({
  selector: 'app-base-article-list',
  templateUrl: './base-article-list.component.html',
  styleUrls: ['./base-article-list.component.css']
})
export class BaseArticleListComponent implements OnInit {
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
  status!: string;

  constructor(
    public loadEnvService: LoadEnvService,
    public seo: SeoService,
    public articleService: ArticleService,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public translate: TranslateService,
    public navigate: NavigationService,
    public dialogEntryRef: MatDialog,
    public dialogDeleteRef: MatDialog,
    @Inject(PLATFORM_ID) public platformId: any
  ) { }

  public setArticlesReadingTime(articles: Article[]): void {
    for (const article of articles) {
      calcReadingTime(article);
    }
  }

  private getTotalViewsOfArticle(article: Article) {
    this.articleService.getNberOfViews(article.id)
      .subscribe(val => article.totalViews = val)
  }

  public setArticlesTotalViews(articles: Article[]): void {
    for (const article of articles) {
      this.getTotalViewsOfArticle(article);
    }
  }

  public isAuthor(user: any, article: Article): boolean {
    return user?.id === article?.author?.id
  }

  public openArticleEntryDialog(): void {
    this.dialogEntryRef.open(ArticleEntryPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        router: this.router
      }
    });
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
      return;
    }

    this.scrollyPageNumber += 1;

    const queryParam = this.route.snapshot.queryParamMap.get('sortBy')!;

    if (queryParam === this.DRAFT) {
      return this.articleService
        .findAllMyArticles(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.DRAFT
        )
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
    }

    if (queryParam === 'in-review') {
      return this.articleService
        .findAllMyArticles(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.IN_REVIEW
        )
        .subscribe((response: any) => this.handleNewFetchedArticles(response));
    }

    this.articleService
      .findAllMyArticles(
        this.scrollyPageNumber,
        this.pageItemsLimit,
        this.PUBLISHED
      )
      .subscribe((response: any) => this.handleNewFetchedArticles(response));
  }

  public sortArticle(list: Article[]): Article[] {
    return list
      ?.sort((a: any, b: any) => {
        if (a.status != "PUBLISHED") {
          return new Date(b.lastSavedAt).valueOf() - new Date(a.lastSavedAt).valueOf()
        }
        return new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf()
      })
  }

  public handleNewFetchedArticles({ content, hasNext }: any) {
    // const newArticles = this.sortArticle(content);
    const newArticles = [...content];
    this.loadingMore = false;
    this.hasNext = hasNext;
    this.setArticlesReadingTime(newArticles);
    this.setArticlesTotalViews(newArticles);

    if (newArticles.length === 0) {
      this.notEmptyArticles = false;
    }

    this.articles = this.articles.concat(newArticles);
    this.notScrolly = true;
  }

  public handleFetchedArticles = {
    next: ({ content, hasNext }: any) => {
      // this.articles = this.sortArticle(content);
      this.articles = content;
      this.setArticlesReadingTime(this.articles);
      this.setArticlesTotalViews(this.articles);
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

  public capitalize(str: string): string {
    return capitalizeString(str);
  }

  ngOnInit(): void {
  }

}
