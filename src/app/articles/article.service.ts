import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, Author, Tag } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  readonly apiServerUrl = environment.apiBaseUrl;
  public loading = false;

  private articleSubject$ = new BehaviorSubject<Article[]>([]);
  public articles$: Observable<Article[]> = this.articleSubject$.asObservable();

  private tagSubject$ = new BehaviorSubject<Tag[]>([]);
  public tags$: Observable<Tag[]> = this.tagSubject$.asObservable();

  constructor(private http: HttpClient) {
    // this.loadAllArticles();
    this.loadAllTags();
  }

  private loadAllArticles() {
    this.loading = true;

    this.articles$ = this.http.get<Article[]>(`${this.apiServerUrl}/article?pageNumber=0&pageSize=5&status=published`)
      .pipe(
        catchError(error => {
          this.loading = false;
          return throwError(() => error);
        }),
        tap(articles => {
          this.loading = false;
          this.articleSubject$.next(articles)
          console.log('ARTICLES LIST: ', this.articles$);
        })
      )
  }

  private loadAllTags() {
    this.tags$ = this.http.get<Tag[]>(`${this.apiServerUrl}/tag`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(tags => {
          console.log('TAGS');
          this.tagSubject$.next(tags)
        })
      )
  }

  // private loadAllTags() {
  //   const loadTags$ = this.http.get<Tag[]>(`${this.apiServerUrl}/tag`)
  //     .pipe(
  //       catchError(error => {
  //         const messagge = 'Impossible de recupérer la liste de tags'
  //         this.messageService.openSnackBarError(messagge, 'Ok', 0);
  //         return throwError(() => error);
  //       }),
  //       tap(tags => {
  //         console.log('TAGS');
  //         this.tagSubject$.next(tags)
  //       })
  //     )

  //   loadTags$.subscribe();
  // }


  public getArticles(page: number, limit: number, status: string): Observable<Article[]> {
    return this.http.get<any>(`${this.apiServerUrl}/article?pageNumber=${page}&pageSize=${limit}&status=${status}`)
      .pipe(
        map(({ content }) => content)
      );
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
