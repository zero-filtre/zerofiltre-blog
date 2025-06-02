import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { ArticleService } from '../articles/article.service';
import { CourseService } from '../school/courses/course.service';
import { CompanyService } from '../admin/features/companies/company.service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private articleService: ArticleService,
    private courseService: CourseService,
    private companyService: CompanyService
  ) {}

  getGlobalStats(): Observable<any> {
    return forkJoin({
      articles: this.articleService
        .findAllArticles(0, 100, 'PUBLISHED')
        .pipe(map((response) => response['numberOfElements'] || 0)),
      courses: this.courseService
        .fetchAllCourses(0, 100, 'PUBLISHED')
        .pipe(map((response) => response['numberOfElements'] || 0)),
      organizations: this.companyService
        .getCompanies(0, 100)
        .pipe(map((response) => response['numberOfElements'] || 0)),
    }).pipe(shareReplay());
  }
}
