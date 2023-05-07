import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { capitalizeString, getCurrentYear } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo.service';
import { Course } from 'src/app/school/courses/course';
import { CourseService } from 'src/app/school/courses/course.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear!: number;
  recentArticles$!: Observable<Article[]>;
  recentCourses$!: Observable<Course[]>;
  PUBLISHED = 'published';

  readonly servicesUrl = environment.servicesUrl;
  readonly blogUrl = environment.blogUrl;
  readonly activeCourseModule = environment.courseRoutesActive === 'true';

  prod = this.blogUrl.startsWith('https://dev.') ? false : true;

  constructor(
    private loadEnvService: LoadEnvService,
    private articleService: ArticleService,
    private courseService: CourseService,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformID: any
  ) { }

  loadCurrentYear() {
    this.currentYear = getCurrentYear();
  }

  capitalize(str: string): string {
    return capitalizeString(str);
  }

  isMounted(): boolean {
    return this.seo.isFooterMounted
  }

  fetchRecentArticles() {
    this.recentArticles$ = this.articleService
      .findAllArticleByFilter(0, 5, this.PUBLISHED)
      .pipe(
        map(({ content }: any) => {
          return content;
        }),
        // tap(console.log)
      )
  }

  fetchRecentCpourses() {
    this.recentCourses$ = this.courseService
      .fetchAllCoursesByFilter(0, 5, this.PUBLISHED)
      .pipe(
        map(({ content }: any) => {
          return content;
        }),
        // tap(console.log)
      )
  }

  ngOnInit(): void {
    this.isMounted();
    
    if (isPlatformBrowser(this.platformID)) {
      this.loadCurrentYear();
      this.fetchRecentArticles();
      this.fetchRecentCpourses();
    }
    
  }

}
