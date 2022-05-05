import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, Author, Tag } from './article.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  readonly apiServerUrl = environment.apiBaseUrl;
  private articleAuthorId!: string;

  private articleSubject$ = new BehaviorSubject<Article[]>([]);
  public articles$: Observable<Article[]> = this.articleSubject$.asObservable();

  private tagSubject$ = new BehaviorSubject<Tag[]>([]);
  public tags$: Observable<Tag[]> = this.tagSubject$.asObservable();

  private refreshData!: boolean

  constructor(private http: HttpClient) { }

  private sortByDate(list: Article[]): Article[] {
    return list
      ?.sort((a: any, b: any) => new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf())
  }

  public findAllArticles(page: number, limit: number, status: string): Observable<Article[]> {
    if (this.refreshData) {
      httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
    }
    return this.http.get<any>(`${this.apiServerUrl}/article?pageNumber=${page}&pageSize=${limit}&status=${status}`, httpOptions)
      .pipe(
        // map(({ content }) => content),
        tap(_ => {
          this.refreshData = false
          httpOptions.headers = httpOptions.headers.delete('x-refresh');
        }),
        shareReplay()
      );
  }

  public findAllMyArticles(page: number, limit: number, status: string): Observable<Article[]> {
    if (this.refreshData) {
      httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
    }
    return this.http.get<any>(`${this.apiServerUrl}/user/articles?pageNumber=${page}&pageSize=${limit}&status=${status}`, httpOptions)
      .pipe(
        tap(_ => {
          this.refreshData = false
          httpOptions.headers = httpOptions.headers.delete('x-refresh');
        }),
        shareReplay()
      );
  }

  public findAllRecentArticles(page: number, limit: number): Observable<Article[]> {
    if (this.refreshData) {
      httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
    }
    return this.http.get<any>(`${this.apiServerUrl}/article?pageNumber=${page}&pageSize=${limit}&status=published`, httpOptions)
      .pipe(
        tap(_ => {
          this.refreshData = false
          httpOptions.headers = httpOptions.headers.delete('x-refresh');
        }),
        shareReplay()
      );
  }

  public findAllArticlesByPopularity(page: number, limit: number): Observable<Article[]> {
    if (this.refreshData) {
      httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
    }
    return this.http.get<any>(`${this.apiServerUrl}/article?pageNumber=${page}&pageSize=${limit}&status=published&byPopularity=true`, httpOptions)
      .pipe(
        tap(_ => {
          this.refreshData = false
          httpOptions.headers = httpOptions.headers.delete('x-refresh');
        }),
        shareReplay()
      );
  }

  public findAllArticlesByTag(page: number, limit: number, tagName: string): Observable<Article[]> {
    if (this.refreshData) {
      httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
    }
    return this.http.get<any>(`${this.apiServerUrl}/article?pageNumber=${page}&pageSize=${limit}&status=published&tag=${tagName}`, httpOptions)
      .pipe(
        tap(_ => {
          this.refreshData = false
          httpOptions.headers = httpOptions.headers.delete('x-refresh');
        }),
        shareReplay()
      );
  }

  public findArticleById(articleId: string): Observable<Article> {
    if (this.refreshData) {
      httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
    }
    return this.http.get<Article>(`${this.apiServerUrl}/article/${articleId}`, httpOptions)
      .pipe(
        tap(_ => {
          this.refreshData = false
          httpOptions.headers = httpOptions.headers.delete('x-refresh');
        }),
        shareReplay()
      );
  }

  public getListOfTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiServerUrl}/tag`)
      .pipe(
        shareReplay()
      );
  }

  public updateToSave(article: Article): Observable<Article> {
    return this.http.patch<Article>(`${this.apiServerUrl}/article`, article)
      .pipe(
        tap(_ => this.refreshData = true),
        shareReplay()
      );
  }

  public updateToPublish(article: Article): Observable<Article> {
    return this.http.patch<Article>(`${this.apiServerUrl}/article/publish`, article)
      .pipe(
        tap(_ => this.refreshData = true),
        shareReplay()
      );
  }

  public deleteArticle(articleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/article/${articleId}`, {
      responseType: 'text' as 'json'
    }).pipe(
      tap(_ => this.refreshData = true),
      shareReplay()
    );
  }

  public createArticle(title: string): Observable<Article> {
    return this.http.post<Article>(`${this.apiServerUrl}/article?title=${title}`, {})
      .pipe(
        tap(_ => this.refreshData = true),
        shareReplay()
      );
  }

  public addReactionToAnArticle(articleId: string, action: string): Observable<any> {
    return this.http.post<string>(`${this.apiServerUrl}/reaction?articleId=${articleId}&action=${action}`, {})
      .pipe(
        tap(_ => this.refreshData = true),
        shareReplay()
      );
  }

  public canEditArticle(currentUsrId: any, articleId: any, isAdminUser: boolean): Observable<any> {
    return this.findArticleById(articleId)
      .pipe(
        tap((article: Article) => {
          this.articleAuthorId = article?.author?.id!
        }),
        mergeMap(_ => of(currentUsrId === this.articleAuthorId || isAdminUser)),
        shareReplay()
      )
  }
}