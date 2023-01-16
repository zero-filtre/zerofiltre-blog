import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Tag } from '../article.model';
import { ArticleService } from '../article.service';
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { sortByNameAsc } from 'src/app/services/utilities.service';
import { AuthService } from 'src/app/user/auth.service';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { BaseArticleListComponent } from '../../shared/base-article-list/base-article-list.component';
import { NavigationService } from '../../services/navigation.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent extends BaseArticleListComponent implements OnInit, OnDestroy {
  tagList!: Tag[];

  RECENT = 'recent';
  POPULAR = 'popular';
  TRENDING = 'most_viewed';
  TAGS = 'tags';

  dddSponsorContentSourceUrl = 'assets/images/ddd-imagee.svg'

  noArticlesAvailable!: boolean;
  loadArticlesErrorMessage!: boolean;

  activePage: string = this.RECENT;
  mainPage = true;

  openedTagsDropdown = false;
  activeTag!: string;


  tags$!: Subscription;
  articles$!: Subscription;
  status!: string;
  tag!: string;

  nberOfViews: Observable<any>;

  constructor(
    public loadEnvService: LoadEnvService,
    public seo: SeoService,
    public articleService: ArticleService,
    public dialogEntryRef: MatDialog,
    public dialogDeleteRef: MatDialog,

    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public translate: TranslateService,
    public navigate: NavigationService,
    private tagService: TagService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    super(loadEnvService, seo, articleService, router, route, authService, translate, navigate, dialogEntryRef, dialogDeleteRef, platformId)
  }

  fetchListOfTags(): void {
    this.loading = true;
    this.tags$ = this.tagService
      .getListOfTags()
      .subscribe({
        next: (response: Tag[]) => {
          const sortedList = sortByNameAsc(response);
          this.tagList = sortedList
          this.loading = false;
        },
        error: (_error: HttpErrorResponse) => {
          this.loading = false;
        }
      })
  }

  sortByTag(tagName: any): void {
    this.openedTagsDropdown = false;
    this.activeTag = tagName;

    this.router.navigateByUrl(`/articles?tag=${tagName}`)

    this.scrollyPageNumber = 0;
    this.notEmptyArticles = true;
  }

  fetchRecentArticles(): void {
    this.loading = true;
    this.articles$ = this.articleService
      .findAllArticleByFilter(this.pageNumber, this.pageItemsLimit, this.PUBLISHED)
      .subscribe(this.handleFetchedArticles)
  }

  fetchPopularArticles(): void {
    this.loading = true;
    this.articles$ = this.articleService
      .findAllArticleByFilter(this.pageNumber, this.pageItemsLimit, this.PUBLISHED, this.POPULAR)
      .subscribe(this.handleFetchedArticles)
  }

  fetchTrendingArticles(): void {
    this.loading = true;
    this.articles$ = this.articleService
      .findAllArticleByFilter(this.pageNumber, this.pageItemsLimit, this.PUBLISHED, this.TRENDING)
      .subscribe(this.handleFetchedArticles)
  }

  fetchArticlesByTag(tagName: string): void {
    this.loading = true;
    this.articles$ = this.articleService
      .findAllArticlesByTag(this.pageNumber, this.pageItemsLimit, tagName)
      .subscribe(this.handleFetchedArticles)
  }

  sortBy(trendName: string): void {
    this.activeTag = '';

    if (trendName === this.RECENT) {
      this.activePage = this.RECENT;
      this.router.navigateByUrl('/articles');
    }

    if (trendName === this.POPULAR) {
      this.activePage = this.POPULAR
      this.router.navigateByUrl(`/articles?filter=${trendName}`);
    }

    if (trendName === this.TRENDING) {
      this.activePage = this.TRENDING
      this.router.navigateByUrl(`/articles?filter=${trendName}`);
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

  fetchMoreArticles(): any {
    this.scrollyPageNumber += 1;

    const queryParamOne = this.route.snapshot.queryParamMap.get('filter')!;
    const queryParamTwo = this.route.snapshot.queryParamMap.get('tag')!;

    if (queryParamOne === this.POPULAR) {
      return this.articleService
        .findAllArticleByFilter(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.PUBLISHED,
          this.POPULAR
        )
        .subscribe((response: any) => this.handleFetchNewArticles(response));
    }

    if (queryParamOne === this.TRENDING) {
      return this.articleService
        .findAllArticleByFilter(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.PUBLISHED,
          this.TRENDING
        )
        .subscribe((response: any) => this.handleFetchNewArticles(response));
    }

    if (queryParamTwo) {
      return this.articleService
        .findAllArticlesByTag(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          queryParamTwo
        )
        .subscribe((response: any) => this.handleFetchNewArticles(response));
    }

    this.articleService
      .findAllArticleByFilter(
        this.scrollyPageNumber,
        this.pageItemsLimit,
        this.PUBLISHED,
      )
      .subscribe((response: any) => this.handleFetchNewArticles(response));

  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchListOfTags()

      this.route.queryParamMap.subscribe(
        query => {
          this.status = query.get('filter')!;
          this.tag = query.get('tag')!;

          if (this.tag) {
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

          if (this.status == this.TRENDING) {
            this.activePage = this.status;
            return this.fetchTrendingArticles();
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
