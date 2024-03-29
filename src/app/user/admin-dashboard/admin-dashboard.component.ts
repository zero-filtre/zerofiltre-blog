import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArticleService } from 'src/app/articles/article.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from '../auth.service';
import { BaseArticleListComponent } from '../../shared/base-article-list/base-article-list.component';
import { MessageService } from 'src/app/services/message.service';
import { JsonLdService } from 'ngx-seo';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent extends BaseArticleListComponent implements OnInit {

  constructor(
    public loadEnvService: LoadEnvService,
    public seo: SeoService,
    public jsonLd: JsonLdService,
    public articleService: ArticleService,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public translate: TranslateService,
    public navigate: NavigationService,
    public dialogEntryRef: MatDialog,
    public dialogDeleteRef: MatDialog,
    public messageService: MessageService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    super(loadEnvService, seo, jsonLd, articleService, router, route, authService, translate, navigate, dialogEntryRef, dialogDeleteRef, messageService, platformId)
  }

  fetchAllArticlesAsAdmin(status: string) {
    this.loading = true;
    this.subscription$ = this.articleService
      .findAllArticles(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedArticles);
  }

  sortBy(tab: string): void {
    this.articles = [];

    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.router.navigateByUrl('/user/dashboard/admin');
    }

    if (tab === this.DRAFT) {
      this.activePage = this.DRAFT;
      this.router.navigateByUrl(`/user/dashboard/admin?filter=${tab}`);
    }

    if (tab === this.IN_REVIEW) {
      this.activePage = this.IN_REVIEW;
      this.router.navigateByUrl(`/user/dashboard/admin?filter=${tab}`);
    }

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  fetchMoreArticles(): any {
    this.scrollyPageNumber += 1;

    const queryParam = this.route.snapshot.queryParamMap.get('filter')!;

    if (queryParam === this.DRAFT) {
      return this.articleService
        .findAllArticleByFilter(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.DRAFT
        )
        .subscribe((response: any) => this.handleFetchNewArticles(response));
    }

    if (queryParam === 'in-review') {
      return this.articleService
        .findAllArticleByFilter(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.IN_REVIEW
        )
        .subscribe((response: any) => this.handleFetchNewArticles(response));
    }

    this.articleService
      .findAllArticleByFilter(
        this.scrollyPageNumber,
        this.pageItemsLimit,
        this.PUBLISHED
      )
      .subscribe((response: any) => this.handleFetchNewArticles(response));
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParamMap.subscribe(
        query => {
          this.status = query.get('filter')!;
          if (!this.status) {
            this.activePage = this.PUBLISHED;
            return this.fetchAllArticlesAsAdmin(this.PUBLISHED);
          }

          this.activePage = this.status;
          this.fetchAllArticlesAsAdmin(this.status);
        }
      );
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.adminDashboadTitle'),
      description: this.translate.instant('meta.adminDashboadDescription'),
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription$.unsubscribe();
    }
  }
}
