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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent extends BaseArticleListComponent implements OnInit {

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
  ) {
    super(loadEnvService, seo, articleService, router, route, authService, translate, navigate, dialogEntryRef, dialogDeleteRef, platformId)
  }

  public fetchMyArticlesByStatus(status: string) {
    this.loading = true;
    this.subscription$ = this.articleService
      .findAllMyArticles(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedArticles);
  }

  public sortBy(tab: string): void {
    this.articles = [];

    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.router.navigateByUrl('/user/dashboard');
    }

    if (tab === this.DRAFT) {
      this.activePage = this.DRAFT;
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
    }

    if (tab === this.IN_REVIEW) {
      this.activePage = this.IN_REVIEW;
      this.router.navigateByUrl(`/user/dashboard?sortBy=${tab}`);
    }

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParamMap.subscribe(
        query => {
          this.status = query.get('sortBy')!;
          if (!this.status) {
            this.activePage = this.PUBLISHED;
            return this.fetchMyArticlesByStatus(this.PUBLISHED);
          }

          this.activePage = this.status;
          this.fetchMyArticlesByStatus(this.status);
        }
      );
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.dashboadTitle'),
      description: this.translate.instant('meta.dashboadDescription'),
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription$.unsubscribe();
    }
  }
}
