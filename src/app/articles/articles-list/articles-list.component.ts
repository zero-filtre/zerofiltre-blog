import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent implements OnInit {
  public articles!: Article[];

  constructor(private articleService: ArticleService) { }

  public getArticles(): void {
    this.articleService.getArticles().subscribe(
      (response: Article[]) => {
        this.articles = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public sortByTrend(trendName: string): void {
    this.articles = [{ title: 'un article qui a ete filtre' }]
  }

  public sortByTag(tagName: string): void {
    this.articles = [{ title: 'un article qui a ete filtre' }]
  }

  public searchArticles(key: string): void {
    const results: Article[] = []

    for (const article of this.articles) {
      if (
        article.title?.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        article.tags?.some(tag => tag.name?.toLowerCase().indexOf(key.toLowerCase()) !== -1)
      ) {
        results.push(article)
      }

      this.articles = results
      if (results.length === 0 || !key) {
        this.getArticles()
      }
    }
  }

  ngOnInit(): void {
    this.getArticles();
  }
}
