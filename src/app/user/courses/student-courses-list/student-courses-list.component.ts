import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CourseDeletePopupComponent } from '../../../school/courses/course-delete-popup/course-delete-popup.component';
import { CourseService } from 'src/app/school/courses/course.service';
import { catchError, forkJoin, map, Observable, Subscription, switchMap, tap, throwError } from 'rxjs';
import { Course } from 'src/app/school/courses/course';
import { User } from '../../user.model';
import { BaseCourseListComponent } from 'src/app/shared/base-course-list/base-course-list.component';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from 'src/app/services/seo.service';
import { LoadEnvService } from 'src/app/services/load-env.service';

@Component({
  selector: 'app-student-courses-list',
  templateUrl: './student-courses-list.component.html',
  styleUrls: ['./student-courses-list.component.css']
})
export class StudentCoursesListComponent extends BaseCourseListComponent implements OnInit, OnDestroy {
  courses$: Subscription;
  // courses$: Observable<Course[]>;

  courses: any = [];
  pageSize: number = 5;

  IN_PROGRESS = 'false';
  COMPLETED = 'true';

  noCoursesAvailable: boolean = false;
  loadingMore: boolean = false;
  notEmptyCourses: boolean = false;
  loading: boolean = false;

  activePage: string = this.IN_PROGRESS;
  mainPage = true;


  constructor(
    public loadEnvService: LoadEnvService,
    public seo: SeoService,
    public router: Router,
    public route: ActivatedRoute,
    public courseService: CourseService,
    public authService: AuthService,
    public translate: TranslateService,
    public dialogEntryRef: MatDialog,
    public dialogDeleteRef: MatDialog,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    super(loadEnvService, seo, router, route, courseService, authService, translate, dialogEntryRef, dialogDeleteRef)
  }

  onScroll() { }
e
  openCourseDeleteDialog(courseId: any): void {
    this.dialogDeleteRef.open(CourseDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: courseId,
        history: this.router.url
      }
    });
  }

  canAccessCourse(courseId: any) {
    const user = this.authService?.currentUsr as User
    return this.courseService.canAccessCourse(user, courseId);
  }

  canEditCourse(course: Course) {
    const user = this.authService?.currentUsr as User
    return this.courseService.canEditCourse(user, course);
  }

  sortByTab(tab: string) {
    this.courses = [];

    if (tab === this.IN_PROGRESS) {
      this.activePage = this.IN_PROGRESS;
      this.router.navigateByUrl('/user/dashboard/courses?completed=false');
    }

    if (tab === this.COMPLETED) {
      this.activePage = this.COMPLETED;
      this.router.navigateByUrl('/user/dashboard/courses?completed=true');
    }

    this.scrollyPageNumber = 0;
    this.notEmptyCourses = true;
  }

  fetchAllCoursesByStatus(status: string) {
    this.loading = true;
    const payload = { pageSize: this.pageItemsLimit, pageNumber: this.pageNumber, completed: status }

    this.subscription$ = this.courseService
      .findAllSubscribedCourses(payload)
      .subscribe(this.handleFetchedCourses);
  }

  fetchMoreCourses(): any {
    this.scrollyPageNumber += 1;

    const queryParam = this.route.snapshot.queryParamMap.get('completed')!;
    const payload = { pageSize: this.pageItemsLimit, pageNumber: this.scrollyPageNumber, completed: this.COMPLETED }

    if (queryParam === this.IN_PROGRESS) {
      return this.courseService
        .findAllSubscribedCourses({ ...payload, completed: this.IN_PROGRESS })
        .subscribe((response: any) => this.handleFetchNewCourses(response));
    }

    this.courseService
      .findAllSubscribedCourses(payload)
      .subscribe((response: any) => this.handleFetchNewCourses(response));
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParamMap.subscribe(
        query => {
          this.status = query.get('completed')!;
          if (!this.status) {
            this.activePage = this.IN_PROGRESS;
            return this.fetchAllCoursesByStatus(this.IN_PROGRESS);
          }

          this.activePage = this.status;
          this.fetchAllCoursesByStatus(this.status);
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
      this.subscription$.unsubscribe();
    }
  }

}
