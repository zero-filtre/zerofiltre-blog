import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Tag } from 'src/app/articles/article.model';
import { AuthService } from '../../../user/auth.service';
import { CourseInitPopupComponent } from '../course-init-popup/course-init-popup.component';
import { CourseDeletePopupComponent } from '../course-delete-popup/course-delete-popup.component';
import { User } from 'src/app/user/user.model';
import { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-list-page',
  templateUrl: './course-list-page.component.html',
  styleUrls: ['./course-list-page.component.css']
})
export class CourseListPageComponent implements OnInit {
  tagList: Tag[] = [];
  courses: any[] = [];
  pageSize: number = 5;

  RECENT = 'recent';
  POPULAR = 'popular';
  TRENDING = 'most_viewed';
  TAGS = 'tags';

  dddSponsorContentSourceUrl = 'assets/images/ddd-imagee.svg'
  noArticlesAvailable: boolean = false;
  loadingMore: boolean = false;
  notEmptyArticles: boolean = false;
  loading: boolean = false;

  activePage: string = this.RECENT;
  mainPage = true;

  openedTagsDropdown = false;
  activeTag!: string;

  constructor(
    public authService: AuthService,
    private dialogDeleteRef: MatDialog,
    public dialogEntryRef: MatDialog,
    private router: Router,
    private courseService: CourseService
  ) { }

  onScroll() { }

  get canCreateCourse() {
    const user = this.authService?.currentUsr as User
    return this.courseService.canCreateCourse(user);
  }

  canAccessCourse(courseId: any) {
    const user = this.authService?.currentUsr as User
    if (!user) return false;

    return user?.courseIds?.includes(courseId) || this.authService.isAdmin;
  }

  canEditCourse(course: Course) {
    const userId = (this.authService?.currentUsr as User)?.id
    if (!userId) return false;

    return course?.author?.id === userId || course?.editorIds?.includes(userId) || this.authService.isAdmin;
  }

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

  loadData() {
    this.loading = true;

    this.courseService.fetchAllCourses()
      .subscribe(data => {
        this.loading = false;
        this.courses = data;
      });

  }

  ngOnInit(): void {
    this.loadData();
  }

}
