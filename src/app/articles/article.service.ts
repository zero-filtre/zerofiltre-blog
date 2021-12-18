import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  readonly apiServerUrl = '';

  constructor(private http: HttpClient) { }

  public getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiServerUrl}/list`);
  }

  public getOneArticle(articleId: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiServerUrl}/list/${articleId}`);
  }

   public addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(`${this.apiServerUrl}/article/add`, article);
  }

  public updateArticle(article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiServerUrl}/article/update`, article);
  }

  public deleteArticle(articleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/article/delete/${articleId}`);
  }
}
