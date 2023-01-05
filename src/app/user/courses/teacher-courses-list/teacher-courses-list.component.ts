import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tag } from 'src/app/articles/article.model';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CourseInitPopupComponent } from 'src/app/school/courses/course-init-popup/course-init-popup.component';
import { CourseDeletePopupComponent } from 'src/app/school/courses/course-delete-popup/course-delete-popup.component';
import { Course } from 'src/app/school/courses/course';
import { CourseService } from 'src/app/school/courses/course.service';
import { User } from '../../user.model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-teacher-courses-list',
  templateUrl: './teacher-courses-list.component.html',
  styleUrls: ['./teacher-courses-list.component.css']
})
export class TeacherCoursesListComponent implements OnInit {
  courses$: Observable<Course[]>;

  courses: Course[] = [];
  pageSize: number = 5;

  PUBLISHED = 'published';
  DRAFT = 'draft';
  IN_REVIEW = 'in_review';


  noCourseAvailable: boolean = false;
  loadingMore: boolean = false;
  notEmptyCourses: boolean = false;
  loading: boolean = false;

  activePage: string = this.PUBLISHED;
  mainPage = true;


  constructor(
    public authService: AuthService,
    private dialogDeleteRef: MatDialog,
    public dialogEntryRef: MatDialog,
    private router: Router,
    private courseService: CourseService
  ) { }

  onScroll() { }

  isAuthor(course: Course): boolean {
    return this.courseService.isAuthor(this.authService.currentUsr, course);
  }

  canAccessCourse(courseId: any) {
    const user = this.authService?.currentUsr as User
    return this.courseService.canAccessCourse(user, courseId);
  }

  canEditCourse(course: Course) {
    const user = this.authService?.currentUsr as User
    return this.courseService.canEditCourse(user, course);
  }

  openCourseEntryDialog(): void {
    this.dialogEntryRef.open(CourseInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
    });
  }

  openCourseDeleteDialog(courseId: any): void {
    this.dialogDeleteRef.open(CourseDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: courseId,
        history: this.router.url
      }
    });
  }

  sortByTab(tab: string) {
    this.courses = [];

    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.loadInPublishedCourses();
    }

    if (tab === this.DRAFT) {
      this.activePage = this.DRAFT;
      this.loadDraftCourses();
    }

    if (tab === this.IN_REVIEW) {
      this.activePage = this.IN_REVIEW;
      this.loadInReviewCourses();
    }
  }

  loadInReviewCourses() {
    this.loading = true;

    setTimeout(() => {
      this.courses$ = this.courseService.getAllCreatedCoursesByStatus(this.authService.currentUsr, this.IN_REVIEW)
        .pipe(
          tap(data => {
            this.loading = false;
            this.courses = data;
          })
        )
    }, 1000);
  }

  loadDraftCourses() {
    this.loading = true;

    setTimeout(() => {
      this.courses$ = this.courseService.getAllCreatedCoursesByStatus(this.authService.currentUsr, this.DRAFT)
        .pipe(
          tap(data => {
            this.loading = false;
            this.courses = data;
          })
        )
    }, 1000);
  }

  loadInPublishedCourses() {
    this.loading = true;

    setTimeout(() => {
      this.courses$ = this.courseService.getAllCreatedCoursesByStatus(this.authService.currentUsr, this.PUBLISHED)
        .pipe(
          tap(data => {
            this.loading = false;
            this.courses = data;
          })
      )
    }, 1000);
  }

  ngOnInit(): void {
    this.loadInPublishedCourses();
  }

}
