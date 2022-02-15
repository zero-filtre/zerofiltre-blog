import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, Author, Tag } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  readonly apiServerUrl = environment.apiBaseUrl;
  public loading = false;

  private _articlesSubject$ = new BehaviorSubject<Article[]>([]);
  public articles$: Observable<Article[]> = this._articlesSubject$.asObservable();

  private _tagssSubject$ = new BehaviorSubject<Tag[]>([]);
  public tags$: Observable<Tag[]> = this._tagssSubject$.asObservable();

  constructor(private http: HttpClient) {
    // this.loadAllArticles();
    this.loadAllTags();
  }

  private loadAllArticles() {
    this.loading = true;

    this.http.get<Article[]>(`${this.apiServerUrl}/article`)
      .pipe(
        catchError(error => {
          this.loading = false;
          return throwError(() => error);
        }),
        tap(articles => {
          this.loading = false;
          this._articlesSubject$.next(articles)
        })
      )
  }

  private loadAllTags() {
    this.http.get<Tag[]>(`${this.apiServerUrl}/tag`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(tags => {
          this._tagssSubject$.next(tags)
        })
      )
  }


  public getArticles(page: number, limit: number, status: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiServerUrl}/article?pageNumber=${page}&pageSize=${limit}&status=${status}`);
  }

  public getOneArticle(articleId: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiServerUrl}/article/${articleId}`);
  }

  public addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(`${this.apiServerUrl}/article/add`, article);
  }

  public updateToSave(article: Article): Observable<Article> {
    return this.http.patch<Article>(`${this.apiServerUrl}/article`, article);
  }

  public updateToPublish(article: Article): Observable<Article> {
    return this.http.patch<Article>(`${this.apiServerUrl}/article/publish`, article);
  }

  public deleteArticle(articleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/article/delete/${articleId}`);
  }

  public getListOfTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiServerUrl}/tag`);
  }

  public getArticleTags(articleId: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiServerUrl}/article/${articleId}/tags`);
  }

  public getArticleAuthor(articleId: string): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiServerUrl}/article/${articleId}/author`);
  }

  public createArticle(title: string): Observable<Article> {
    return this.http.post<Article>(`${this.apiServerUrl}/article?title=${title}`, {})
  }
}
