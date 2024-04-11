import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JsonLdService } from 'ngx-seo';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/school/courses/course';
import { CourseDeletePopupComponent } from 'src/app/school/courses/course-delete-popup/course-delete-popup.component';
import { CourseInitPopupComponent } from 'src/app/school/courses/course-init-popup/course-init-popup.component';
import { CourseService } from 'src/app/school/courses/course.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { SeoService } from 'src/app/services/seo.service';
import { slugify } from 'src/app/services/utilities.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-base-course-list',
  templateUrl: './base-course-list.component.html',
  styleUrls: ['./base-course-list.component.css']
})
export class BaseCourseListComponent implements OnInit {

  readonly blogUrl = environment.blogUrl;
  readonly activeCourseModule = environment.courseRoutesActive === 'true';
  prod = this.blogUrl.startsWith('https://dev.') ? false : true;
  siteUrl = this.prod ? "https://zerofiltre.tech" : "https://dev.zerofiltre.tech"

  courses: Course[];

  PUBLISHED = 'published';
  DRAFT = 'draft';
  IN_REVIEW = 'in_review';

  notEmptyCourses = true;
  noCourseAvailable: boolean = false;

  notScrolly = true;
  lastPage: number;
  hasNext!: boolean;
  scrollyPageNumber = 0;

  pageNumber: number = 0;
  pageItemsLimit: number = 8;

  loadingMore = false;
  loading = false;

  errorMessage = '';

  activePage: string = this.PUBLISHED;
  mainPage = true;

  subscription$!: Subscription;
  status!: string;

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

    if (newCourses.length === 0) {
      this.notEmptyCourses = false;
    }

    this.courses = this.courses.concat(newCourses);
    this.notScrolly = true;
  }

  handleFetchedCourses = {
    next: ({ content, hasNext }: any) => {

      const dataSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": content.map((course: Course, index: number) => ({
          "@type": "ListItem",
          "position": index+1,
          "item": {
            "@type": "Course",
            "url": `${this.siteUrl}/cours/${slugify(course)}`,
            "name": course.title,
            "author": {
              "@type": "Person",
              "name": course.author.fullName
            },
            "description": course.summary,
            "image": course.thumbnail,
            "datePublished": course.publishedAt?.substring(0, 10),
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "online",
              "CourseWorkload": "PT5H"
            },
            "offers": {
              "@type": "Offer",
              "category": "Intermediaire",
              "price": course.price,
              "priceCurrency": "EUR"
            },
            "provider": {
              "@type": "Organization",
              "name": "Zerofiltre",
              "sameAs": "https://www.zerofiltre.tech"
            }
          }
        }))
      }

      this.jsonLd.setData(dataSchema)

      this.courses = content;
      this.loading = false;
      this.hasNext = hasNext;
      this.noCourseAvailable = false;

      if (this.courses.length === 0) {
        this.errorMessage = 'Aucun cours trouvé 😊!';
        this.noCourseAvailable = true;
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
