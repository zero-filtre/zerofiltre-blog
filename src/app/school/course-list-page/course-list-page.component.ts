import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Tag } from 'src/app/articles/article.model';
import { AuthService } from '../../user/auth.service';
import { CourseInitPopupComponent } from '../course-init-popup/course-init-popup.component';
import { CourseDeletePopupComponent } from '../course-delete-popup/course-delete-popup.component';
import * as courseList from '../fakeData/courses.json'
import { User } from 'src/app/user/user.model';
import { Course } from '../course';

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

  canAccess: boolean = false;
  canEdit: boolean = false;


  constructor(
    public authService: AuthService,
    private dialogDeleteRef: MatDialog,
    public dialogEntryRef: MatDialog,
    private router: Router
  ) { }

  onScroll() { }

  isAuthor(user: any, cours: any): boolean {
    return user?.id === cours?.author?.id
  }

  canAccessCourse(courseId: any) {
    this.canAccess = !!(this.authService?.currentUsr as User)?.courseIds.includes(courseId) || this.authService.isAdmin;
    return this.canAccess;
  }

  canEditCourse(course: Course) {
    const userId = (this.authService?.currentUsr as User)?.id
    this.canEdit = course?.author?.id === userId || course?.editorIds?.includes(userId) || this.authService.isAdmin;
    return this.canEdit;
  }

  openCourseEntryDialog(): void {
    this.dialogEntryRef.open(CourseInitPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
    });
  }

  openCourseDeleteDialog(courseId: number | undefined): void {
    this.dialogDeleteRef.open(CourseDeletePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: courseId,
        history: this.router.url
      }
    });
  }

  loadData() {
    this.loading = true;
    this.activePage = this.RECENT

    const courses$ = new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = (courseList as any).default
        resolve(data);
      }, 1000);
    });

    courses$.then((data: any[]) => {
      this.loading = false;
      this.courses = data;
    })

    const tagList$ = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          ...this.tagList,
          { id: 1, name: 'js', colorCode: '#111' },
        ]);

        this.loading = false;
      }, 1000);
    });

    tagList$.then((data: any[]) => {
      this.loading = false;
      this.tagList = data;
    })
  }

  ngOnInit(): void {
    this.loadData();
  }

}
