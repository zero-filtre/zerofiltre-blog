import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CourseDeletePopupComponent } from '../../../school/courses/course-delete-popup/course-delete-popup.component';
import { CourseService } from 'src/app/school/courses/course.service';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { Course } from 'src/app/school/courses/course';
import { User } from '../../user.model';

@Component({
  selector: 'app-student-courses-list',
  templateUrl: './student-courses-list.component.html',
  styleUrls: ['./student-courses-list.component.css']
})
export class StudentCoursesListComponent implements OnInit {
  courses$: Observable<Course[]>;

  courses: any = [];
  pageSize: number = 5;

  IN_PROGRESS = 'en cours';
  COMPLETED = 'achevés';

  noCoursesAvailable: boolean = false;
  loadingMore: boolean = false;
  notEmptyCourses: boolean = false;
  loading: boolean = false;

  activePage: string = this.IN_PROGRESS;
  mainPage = true;


  constructor(
    public authService: AuthService,
    private dialogDeleteRef: MatDialog,
    public dialogEntryRef: MatDialog,
    private router: Router,
    private courseService: CourseService
  ) { }

  onScroll() { }

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
      this.loadInProgressCourses();
    }

    if (tab === this.COMPLETED) {
      this.activePage = this.COMPLETED;
      this.loadCompletedCourses();
    }
  }

  loadInProgressCourses() {
    this.loading = true;

    setTimeout(() => {
      this.courseService.getAllSubscribedCourseInProgressIds(this.authService.currentUsr.id)
        .pipe(
          switchMap(ids => {
            const data = ids.map(id => this.courseService.findCourseById(id))
            this.loading = false;
            return forkJoin(data).pipe(
              tap(d => {
                this.loading = false;
                this.courses = d;
              }),
              map(values => values)
            )
          })
        ).subscribe()
    }, 1000);

  }

  loadCompletedCourses() {
    this.loading = true;

    setTimeout(() => {
      this.courseService.getAllSubscribedCourseCompletedIds(this.authService.currentUsr.id)
        .pipe(
          switchMap(ids => {
            const data = ids.map(id => this.courseService.findCourseById(id))
            this.loading = false;
            return forkJoin(data).pipe(
              tap(d => {
                this.loading = false;
                this.courses = d;
              }),
              map(values => values)
            )
          })
        ).subscribe()
    }, 1000);

  }

  ngOnInit(): void {
    this.loadInProgressCourses();
  }

}
