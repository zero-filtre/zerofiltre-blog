import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/school/courses/course';
import { CourseDeletePopupComponent } from 'src/app/school/courses/course-delete-popup/course-delete-popup.component';
import { CourseInitPopupComponent } from 'src/app/school/courses/course-init-popup/course-init-popup.component';
import { CourseService } from 'src/app/school/courses/course.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';

@Component({
  selector: 'app-base-course-list',
  templateUrl: './base-course-list.component.html',
  styleUrls: ['./base-course-list.component.css']
})
export class BaseCourseListComponent implements OnInit {
  courses: Course[];

  PUBLISHED = 'published';
  DRAFT = 'draft';
  IN_REVIEW = 'in_review';

  notEmptyCourses = false;
  noCourseAvailable: boolean = false;

  notScrolly = true;
  lastPage: number;
  hasNext: boolean;
  scrollyPageNumber = 0;

  pageNumber: number = 0;
  pageItemsLimit: number = 5;

  loadingMore = false;
  loading = false;

  errorMessage = '';

  activePage: string = this.PUBLISHED;
  mainPage = true;

  subscription$!: Subscription;
  status!: string;

  sponsorContentUrl = '/cours/1';
  sponsorContentImageUrl = 'https://ik.imagekit.io/lfegvix1p/ddd-imagee_7A342RNOT.svg?updatedAt=1681558221642';

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
  ) { }

  get canCreateCourse() {
    const user = this.authService?.currentUsr as User
    return this.courseService.canCreateCourse(user);
  }
  canAccessCourse(course: Course) {
    const user = this.authService?.currentUsr as User
    return this.courseService.canAccessCourse(user, course);
  }
  canEditCourse(course: Course) {
    const user = this.authService?.currentUsr as User
    return this.courseService.canEditCourse(user, course);
  }

  onScroll() {
    if (this.notScrolly && this.notEmptyCourses && this.hasNext) {
      this.loadingMore = true;
      this.notScrolly = false;
      this.fetchMoreCourses();
    }
  }

  fetchMoreCourses(): any {
    // do nothing
  }

  handleFetchNewCourses({ content, hasNext }: any) {
    const newCourses = [...content];
    this.loadingMore = false;
    this.hasNext = hasNext;
    this.notEmptyCourses = hasNext;

    if (newCourses.length === 0) {
      this.notEmptyCourses = false;
    }

    this.courses = this.courses.concat(newCourses);
    this.notScrolly = true;
  }

  handleFetchedCourses = {
    next: ({ content, hasNext }: any) => {
      this.courses = content;

      this.loading = false;
      this.hasNext = hasNext;
      this.notEmptyCourses = hasNext;

      if (this.courses.length === 0) {
        this.errorMessage = 'Aucun cours trouvé 😊!';
      }
    },
    error: (_error: HttpErrorResponse) => {
      this.loading = false;
      this.hasNext = false;
      this.courses = [];
      this.errorMessage = "Oops... une erreur s'est produite!";
    },
  };

  openCourseEntryDialog(): void {
    this.dialogEntryRef.open(CourseInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        history: this.router.url
      }
    });
  }

  openCourseDeleteDialog(courseId: any): void {
    this.dialogDeleteRef.open(CourseDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        courseId,
        history: this.router.url
      }
    });
  }

  ngOnInit(): void {
    // do nothing
  }

}
