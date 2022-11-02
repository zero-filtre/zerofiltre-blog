import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Tag } from 'src/app/articles/article.model';
import { CourseInitPopupComponent } from '../../../school/course-init-popup/course-init-popup.component';
import { CourseDeletePopupComponent } from '../../../school/course-delete-popup/course-delete-popup.component';

@Component({
  selector: 'app-student-courses-list',
  templateUrl: './student-courses-list.component.html',
  styleUrls: ['./student-courses-list.component.css']
})
export class StudentCoursesListComponent implements OnInit {
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

  canAccessCourse() {
    console.log('CAN ACCESS: ', this.authService.isAdmin)
    this.canAccess = this.authService.isAdmin
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
        const data = [
          ...this.courses,
          { id: 1, title: 'mon premier cours', summary: 'un magnifique cours', firstLessonId: 1 },
        ]
        resolve(data);
      }, 1000);
    });

    courses$.then((data: any[]) => {
      console.log('DATA: ', data)
      this.loading = false;
      this.courses = data;
    })

    const tagList$ = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          ...this.tagList,
          { id: 1, name: 'js', colorCode: '#ccc' },
        ]);

        this.loading = false;
      }, 1000);
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.canAccessCourse()
  }

}