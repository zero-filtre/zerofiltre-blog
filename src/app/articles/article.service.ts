import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of, shareReplay, tap, map, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, Author, Tag } from './article.model';
import { isPlatformServer } from '@angular/common';

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

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformID: any
  ) { }

  private sortByDate(list: Article[]): Article[] {
    return list
      ?.sort((a: any, b: any) => new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf())
  }

  public incrementViews(articleId: string): Observable<any> {
    if (isPlatformServer(this.platformID)) return EMPTY

    let total = +localStorage.getItem(`article-${articleId}-views`) || 0;

    return of(total)
      .pipe(map(val => {
        total = val + 1
        localStorage.setItem(`article-${articleId}-views`, JSON.stringify(total))
        return total
      }))
  }

  public getNberOfViews(articleId: any): Observable<any> {
    if (isPlatformServer(this.platformID)) return EMPTY

    const total = +localStorage.getItem(`article-${articleId}-views`) || 0

    return of(total);
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

  public findAllArticlesByTrend(page: number, limit: number): Observable<Article[]> {
    if (this.refreshData) {
      httpOptions.headers = httpOptions.headers.set('xr-refresh', 'true');
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