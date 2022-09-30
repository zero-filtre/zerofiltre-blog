import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Tag } from 'src/app/articles/article.model';
import { AuthService } from '../../user/auth.service';

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
    private router: Router
  ) { }

  onScroll() { }

  isAuthor(user: any, cours: any): boolean {
    return user?.id === cours?.author?.id
  }

  openCourseEntryDialog(): void {
    // this.dialogEntryRef.open(CourseInitPopup, {
    //   width: '850px',
    //   height: '350px',
    //   panelClass: 'article-popup-panel',
    // });
  }

  openCourseDeleteDialog(courseId: number | undefined): void {
    // this.dialogDeleteRef.open(CourseDeletePopup, {
    //   panelClass: 'delete-article-popup-panel',
    //   data: {
    //     id: courseId,
    //     history: this.router.url
    //   }
    // });
  }

  loadData() {
    this.loading = true;
    this.activePage == this.RECENT

    const courses$ = new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = [
          ...this.courses,
          { id: 1, title: 'mon premier cours', summary: 'un magnifique cours' },
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
  }

}