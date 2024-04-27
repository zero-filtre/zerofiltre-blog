import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from 'src/app/articles/article.model';
import { AuthService } from '../../../user/auth.service';
import { CourseService } from '../course.service';
import { Subscription } from 'rxjs';
import { BaseCourseListComponent } from 'src/app/shared/base-course-list/base-course-list.component';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { SeoService } from 'src/app/services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { sortByNameAsc } from 'src/app/services/utilities.service';
import { TagService } from 'src/app/services/tag.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Course } from '../course';
import { JsonLdService } from 'ngx-seo';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-course-list-page',
  templateUrl: './course-list-page.component.html',
  styleUrls: ['./course-list-page.component.css']
})
export class CourseListPageComponent extends BaseCourseListComponent implements OnInit, OnDestroy {
  tagList: Tag[] = [];
  courses: any[] = [];

  RECENT = 'recent';
  POPULAR = 'popular';
  TRENDING = 'most_viewed';
  TAGS = 'tags';

  dddSponsorContentSourceUrl = 'https://ik.imagekit.io/lfegvix1p/ddd-imagee_7A342RNOT.svg?updatedAt=1681558221642';

  activePage: string = this.RECENT;
  mainPage = true;

  openedTagsDropdown = false;
  activeTag: string;

  tags$: Subscription;
  courses$: Subscription;
  status: string;
  tag: string;

  isGrid: boolean;
  mobileQuery: MediaQueryList;

  constructor(
    public loadEnvService: LoadEnvService,
    public seo: SeoService,
    public jsonLd: JsonLdService,
    public router: Router,
    public route: ActivatedRoute,
    public courseService: CourseService,
    public authService: AuthService,
    public translate: TranslateService,
    public dialogEntryRef: MatDialog,
    public dialogDeleteRef: MatDialog,
    private tagService: TagService,
    @Inject(PLATFORM_ID) public platformId: any,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    super(loadEnvService, seo, jsonLd, router, route, courseService, authService, translate, dialogEntryRef, dialogDeleteRef)
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  toggleListDisplay(): void {
    this.isGrid = !this.isGrid;
    localStorage.setItem('grid-list', JSON.stringify(this.isGrid));
    this.openedTagsDropdown = false;
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

  setActiveTag(tag: string) {
    this.activeTag = tag;
  }

  sortByTag(tagName: any): void {
    this.openedTagsDropdown = false;
    // this.activeTag = tagName;
    this.router.navigateByUrl(`/cours?tag=${tagName}`)

    this.scrollyPageNumber = 0;
    this.notEmptyCourses = true;
  }

  sortBy(trendName: string): void {
    this.activeTag = '';

    if (trendName === this.RECENT) {
      this.activePage = this.RECENT;
      this.router.navigateByUrl('/cours');
    }

    if (trendName === this.POPULAR) {
      this.activePage = this.POPULAR
      this.router.navigateByUrl(`/cours?filter=${trendName}`);
    }

    if (trendName === this.TRENDING) {
      this.activePage = this.TRENDING
      this.router.navigateByUrl(`/cours?filter=${trendName}`);
    }

    if (trendName === this.TAGS) {
      this.activePage = this.TAGS
      this.openedTagsDropdown = !this.openedTagsDropdown;
    } else {
      this.openedTagsDropdown = false;
    }

    this.scrollyPageNumber = 0;
    this.notEmptyCourses = true;
  }

  fetchRecentCourses(): void {
    this.loading = true;
    this.courses$ = this.courseService
      .fetchAllCoursesByFilter(this.pageNumber, this.pageItemsLimit, this.PUBLISHED)
      .subscribe(this.handleFetchedCourses)
  }

  fetchPopularCourse(): void {
    this.loading = true;
    this.courses$ = this.courseService
      .fetchAllCoursesByFilter(this.pageNumber, this.pageItemsLimit, this.PUBLISHED, this.POPULAR)
      .subscribe(this.handleFetchedCourses)
  }

  fetchTrendingCourses(): void {
    this.loading = true;
    this.courses$ = this.courseService
      .fetchAllCoursesByFilter(this.pageNumber, this.pageItemsLimit, this.PUBLISHED, this.TRENDING)
      .subscribe(this.handleFetchedCourses)
  }

  fetchCourseByTag(tagName: string): void {
    this.loading = true;
    this.courses$ = this.courseService
      .findAllCoursesByTag(this.pageNumber, this.pageItemsLimit, tagName)
      .subscribe(this.handleFetchedCourses)
  }

  fetchMoreCourses(): any {
    this.scrollyPageNumber += 1;

    const queryParamOne = this.route.snapshot.queryParamMap.get('filter')!;
    const queryParamTwo = this.route.snapshot.queryParamMap.get('tag')!;

    if (queryParamOne === this.POPULAR) {
      return this.courseService
        .fetchAllCoursesByFilter(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.PUBLISHED,
          this.POPULAR
        )
        .subscribe((response: any) => this.handleFetchNewCourses(response));
    }

    if (queryParamOne === this.TRENDING) {
      return this.courseService
        .fetchAllCoursesByFilter(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.PUBLISHED,
          this.TRENDING
        )
        .subscribe((response: any) => this.handleFetchNewCourses(response));
    }

    if (queryParamTwo) {
      return this.courseService
        .findAllCoursesByTag(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          queryParamTwo
        )
        .subscribe((response: any) => this.handleFetchNewCourses(response));
    }

    this.courseService
      .fetchAllCoursesByFilter(
        this.scrollyPageNumber,
        this.pageItemsLimit,
        this.PUBLISHED,
      )
      .subscribe((response: any) => this.handleFetchNewCourses(response));

  }


  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      if (this.mobileQuery.matches) {
        this.isGrid = true;
      } else {
        this.isGrid = localStorage.getItem('grid-list') === null ? true : JSON.parse(localStorage.getItem('grid-list'));
      }

      this.fetchListOfTags();

      this.route.queryParamMap.subscribe(
        query => {
          this.status = query.get('filter')!;
          this.tag = query.get('tag')!;

          if (this.tag) {
            return this.fetchCourseByTag(this.tag);
          }

          if (!this.status) {
            this.activePage ||= this.RECENT;
            return this.fetchRecentCourses();
          }

          if (this.status == this.POPULAR) {
            this.activePage = this.status;
            return this.fetchPopularCourse();
          }

          if (this.status == this.TRENDING) {
            this.activePage = this.status;
            return this.fetchTrendingCourses();
          }
        }
      );

    }

    this.seo.generateTags({
      title: this.translate.instant('meta.coursesTitle'),
      description: this.translate.instant('meta.coursesDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://ik.imagekit.io/lfegvix1p/pro_vvcZRxQIU.png?updatedAt=1714202330763'
    });
  }


  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.tags$.unsubscribe();
      this.courses$.unsubscribe();
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
  }

}
