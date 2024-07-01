import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article } from '../articles/article.model';
import { Course } from '../school/courses/course';
import { ArticleService } from '../articles/article.service';
import { CourseService } from '../school/courses/course.service';
import { Lesson } from '../school/lessons/lesson';
import { ChapterService } from '../school/chapters/chapter.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  readonly apiServerUrl = environment.apiBaseUrl;

  articles: Article[] = [];
  courses: Course[] = [];
  lessons: Lesson[] = [];
  PUBLISHED = 'published';

  constructor(
    private http: HttpClient,
    private articleService: ArticleService,
    private courseService: CourseService,
    private chapterService: ChapterService
  ) {
    this.loadDataBaseData();
  }

  loadDataBaseData(): void {
    this.articleService
      .findAllArticleByFilter(0, 1000, this.PUBLISHED)
      .subscribe((data: any) => (this.articles = data.content));
    this.courseService
      .fetchAllCoursesByFilter(0, 1000, this.PUBLISHED)
      .subscribe((data: any) => {
        this.courses = data.content;
        this.courses.forEach((course) => {
          this.chapterService
            .fetchAllChapters(course.id)
            .subscribe((chapters) => {
              const arr = chapters.map((chapter) =>
                chapter.lessons
                  .map((lesson) => ({ ...lesson, courseId: +chapter.courseId }))
                  .flat()
              );
              this.lessons = [...this.lessons, ...arr.flat()];
            });
        });
      });
  }

  getSearchResults(query: string): (Article | Course | Lesson)[] {
    return this.fakeDataBaseSearch(
      query,
      this.articles,
      this.courses,
      this.lessons
    );
  }

  fakeDataBaseSearch(
    query: string,
    articles: Article[],
    courses: Course[],
    lessons: Lesson[]
  ): (Article | Course | Lesson)[] {
    const lowerCaseQuery = query.toLowerCase();

    const filteredArticles = articles.filter(
      (article) => article.title.toLowerCase().includes(lowerCaseQuery)
      // article.summary.toLowerCase().includes(lowerCaseQuery) ||
      // article.content.toLowerCase().includes(lowerCaseQuery)
    );

    const filteredCourses = courses.filter(
      (course) => course.title.toLowerCase().includes(lowerCaseQuery)
      // course.subTitle.toLowerCase().includes(lowerCaseQuery) ||
      // course.summary.toLowerCase().includes(lowerCaseQuery) ||
      // course.sections.some((section) => section.title.toLowerCase().includes(lowerCaseQuery)) ||
      // course.sections.some((section) => section.content.toLowerCase().includes(lowerCaseQuery))
    );

    const filteredLessons = lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(lowerCaseQuery)
    );

    return [...filteredArticles, ...filteredCourses, ...filteredLessons];
  }

  search(query: string): Observable<any> {
    return of({ results: this.getSearchResults(query) });

    return this.http
      .get<any>(`${this.apiServerUrl}/search?q=${query}`, httpOptions)
      .pipe(shareReplay());
  }
}
