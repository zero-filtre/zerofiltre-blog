import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../app/school/courses/course';
import { CourseService } from '../../../app/school/courses/course.service';
import { LoadEnvService } from '../../../app/services/load-env.service';
import { SeoService } from '../../../app/services/seo.service';
import { BaseCourseListComponent } from '../../../app/shared/base-course-list/base-course-list.component';
import { AuthService } from '../../../app/user/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { JsonLdService } from 'ngx-seo';
import { CompanyService } from '../../../app/admin/features/companies/company.service';

@Component({
  selector: 'app-company-courses',
  templateUrl: './company-courses.component.html',
  styleUrls: ['./company-courses.component.css'],
})
export class CompanyCoursesComponent
  extends BaseCourseListComponent
  implements OnInit, OnDestroy
{
  courses$: Subscription;
  courses: Course[] = [];

  PUBLISHED = 'PUBLISHED';
  IN_REVIEW = 'IN_REVIEW';
  DRAFT = 'DRAFT';
  ARCHIVER = 'ARCHIVED';

  activePage: string = this.PUBLISHED;
  mainPage = true;

  companyId: string;

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
    public companyService: CompanyService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    super(
      loadEnvService,
      seo,
      jsonLd,
      router,
      route,
      courseService,
      authService,
      translate,
      dialogEntryRef,
      dialogDeleteRef
    );
  }

  sortByTab(tab: string): void {
    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.router.navigateByUrl(`/user/dashboard/companies/${this.companyId}/courses`);
    }
    
    if (tab === this.IN_REVIEW) {
      this.activePage = this.IN_REVIEW;
      this.router.navigateByUrl(`/user/dashboard/companies/${this.companyId}/courses?status=${this.IN_REVIEW}`);
    }
    
    if (tab === this.DRAFT) {
      this.activePage = this.DRAFT;
      this.router.navigateByUrl(`/user/dashboard/companies/${this.companyId}/courses?status=${this.DRAFT}`);
    }

    if (tab === this.ARCHIVER) {
      this.activePage = this.ARCHIVER;
      this.router.navigateByUrl(`/user/dashboard/companies/${this.companyId}/courses?status=${this.ARCHIVER}`);
    }

    this.scrollyPageNumber = 0;
    this.notEmptyCourses = true;
  }

  findAllCoursesBycompanyId(companyId: string) {
    this.loading = true;
    this.subscription$ = this.companyService
      .findAllCoursesBycompanyId(companyId, this.pageNumber, this.pageItemsLimit, this.activePage)
      .subscribe(this.handleFetchedCourses);
  }

  fetchMoreCourses(): any {
    this.scrollyPageNumber += 1;

    this.companyService
      .findAllCoursesBycompanyId(
        this.companyId,
        this.scrollyPageNumber,
        this.pageItemsLimit,
        this.activePage
      )
      .subscribe((response: any) => this.handleFetchNewCourses(response));
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe((params) => {
        const parsedParams = params.get('companyId');
        this.companyId = parsedParams!;
      });

      this.route.queryParamMap.subscribe(params => {
        this.activePage = params.get('status') || this.PUBLISHED;
        this.findAllCoursesBycompanyId(this.companyId);
      });

    }

    this.seo.generateTags({
      title: this.translate.instant('meta.coursesTitle'),
      description: this.translate.instant('meta.coursesDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png',
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription$.unsubscribe();
    }
  }
}
