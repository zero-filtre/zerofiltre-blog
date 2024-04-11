import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/school/courses/course';
import { CourseInitPopupComponent } from 'src/app/school/courses/course-init-popup/course-init-popup.component';
import { CourseService } from 'src/app/school/courses/course.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { SeoService } from 'src/app/services/seo.service';
import { BaseCourseListComponent } from 'src/app/shared/base-course-list/base-course-list.component';
import { AuthService } from '../../auth.service';
import { JsonLdService } from 'ngx-seo';

@Component({
  selector: 'app-admin-courses-list',
  templateUrl: './admin-courses-list.component.html',
  styleUrls: ['./admin-courses-list.component.css']
})
export class AdminCoursesListComponent extends BaseCourseListComponent implements OnInit, OnDestroy {
  courses$: Subscription;
  courses: Course[] = [];
  pageSize: number = 5;

  PUBLISHED = 'published';
  DRAFT = 'draft';
  IN_REVIEW = 'in_review';

  activePage: string = this.PUBLISHED;
  mainPage = true;

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
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    super(loadEnvService, seo, jsonLd, router, route, courseService, authService, translate, dialogEntryRef, dialogDeleteRef)
  }

  isAuthor(course: Course): boolean {
    return this.courseService.isAuthor(this.authService.currentUsr, course);
  }

  openCourseEntryDialog(): void {
    this.dialogEntryRef.open(CourseInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
    });
  }

  sortByTab(tab: string): void {
    this.courses = [];

    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.router.navigateByUrl('/user/dashboard/courses/all');
    }

    if (tab === this.DRAFT) {
      this.activePage = this.DRAFT;
      this.router.navigateByUrl(`/user/dashboard/courses/all?filter=${tab}`);
    }

    if (tab === this.IN_REVIEW) {
      this.activePage = this.IN_REVIEW;
      this.router.navigateByUrl(`/user/dashboard/courses/all?filter=${tab}`);
    }

    this.scrollyPageNumber = 0;
    this.notEmptyCourses = true;
  }

  fetchAllCoursesByStatus(status: string) {
    this.loading = true;
    this.subscription$ = this.courseService
      .fetchAllCourses(this.pageNumber, this.pageItemsLimit, status)
      .subscribe(this.handleFetchedCourses);
  }

  fetchMoreCourses(): any {
    this.scrollyPageNumber += 1;

    const queryParam = this.route.snapshot.queryParamMap.get('filter')!;

    if (queryParam === this.DRAFT) {
      return this.courseService
        .getAllMyCreatedCoursesByStatus(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.DRAFT
        )
        .subscribe((response: any) => this.handleFetchNewCourses(response));
    }

    if (queryParam === 'in-review') {
      return this.courseService
        .getAllMyCreatedCoursesByStatus(
          this.scrollyPageNumber,
          this.pageItemsLimit,
          this.IN_REVIEW
        )
        .subscribe((response: any) => this.handleFetchNewCourses(response));
    }

    this.courseService
      .getAllMyCreatedCoursesByStatus(
        this.scrollyPageNumber,
        this.pageItemsLimit,
        this.PUBLISHED
      )
      .subscribe((response: any) => this.handleFetchNewCourses(response));
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParamMap.subscribe(
        query => {
          this.status = query.get('filter')!;
          if (!this.status) {
            this.activePage = this.PUBLISHED;
            return this.fetchAllCoursesByStatus(this.PUBLISHED);
          }

          this.activePage = this.status;
          this.fetchAllCoursesByStatus(this.status);
        }
      );
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.coursesTitle'),
      description: this.translate.instant('meta.coursesDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription$.unsubscribe();
    }
  }

}
