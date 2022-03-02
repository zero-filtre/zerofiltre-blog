import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, Author, Tag } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  readonly apiServerUrl = environment.apiBaseUrl;

  private articleSubject$ = new BehaviorSubject<Article[]>([]);
  public articles$: Observable<Article[]> = this.articleSubject$.asObservable();

  private tagSubject$ = new BehaviorSubject<Tag[]>([]);
  public tags$: Observable<Tag[]> = this.tagSubject$.asObservable();

  constructor(private http: HttpClient) { }

  public findAllArticles(page: number, limit: number, status: string): Observable<Article[]> {
    return this.http.get<any>(`${this.apiServerUrl}/article?pageNumber=${page}&pageSize=${limit}&status=${status}`)
      .pipe(
        map(({ content }) => content),
        shareReplay()
      );
  }

  public findArticleById(articleId: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiServerUrl}/article/${articleId}`)
      .pipe(shareReplay());
  }

  public addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(`${this.apiServerUrl}/article/add`, article)
      .pipe(shareReplay());
  }

  public updateToSave(article: Article): Observable<Article> {
    return this.http.patch<Article>(`${this.apiServerUrl}/article`, article)
      .pipe(shareReplay());
  }

  public updateToPublish(article: Article): Observable<Article> {
    return this.http.patch<Article>(`${this.apiServerUrl}/article/publish`, article)
      .pipe(shareReplay());
  }

  public deleteArticle(articleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/article/delete/${articleId}`)
      .pipe(shareReplay());
  }

  public getListOfTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiServerUrl}/tag`)
      .pipe(
        shareReplay()
      );
  }

  public getArticleTags(articleId: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiServerUrl}/article/${articleId}/tags`)
      .pipe(shareReplay());
  }

  public getArticleAuthor(articleId: string): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiServerUrl}/article/${articleId}/author`)
      .pipe(shareReplay());
  }

  public createArticle(title: string): Observable<Article> {
    return this.http.post<Article>(`${this.apiServerUrl}/article?title=${title}`, {})
      .pipe(shareReplay());
  }
}
