import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Article, Tag } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent implements OnInit {
  public articles!: Article[];
  public tagList!: Tag[];

  constructor(private articleService: ArticleService) { }

  public getArticles(): void {
    this.articleService.getArticles().subscribe(
      (response: Article[]) => {
        this.articles = response;
        this.tagList = response[0].tags
        this.calcReadingTime(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public calcReadingTime(articles: Article[]): void {
    for (const article of articles) {
      const content = article?.content

      const wpm = 225;
      const words = content?.trim().split(/\s+/).length || 0;
      const time = Math.ceil(words / wpm);
      article.readingTime = time
    }
  }

  public sortByTrend(trendName: string): void {
    const results: Article[] = []

    for (const article of this.articles) {
      if (article.reactions?.length !== 0) {
        results.push(article)
      }

      this.articles = results

      if (results.length === 0) {
        this.getArticles()
        console.log("GetArticles Called")
      }
    }

    console.log("SortByTrend", results)
  }

  public sortByTag(tagName: any): void {
    const results: Article[] = []

    for (const article of this.articles) {
      if (article.tags?.some(tag => tag.name?.toLowerCase().indexOf(tagName.toLowerCase()) !== -1)) {
        results.push(article)
      }

      this.articles = results

      if (results.length === 0) {
        this.getArticles()
        console.log("GetArticles Called")
      }
    }

    console.log("SortByTag", results)
  }

  public searchArticles(key: string): void {
    const results: Article[] = []

    for (const article of this.articles) {
      if (
        article.title?.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        article.tags?.some(tag => tag.name?.toLowerCase().indexOf(key.toLowerCase()) !== -1) ||
        article.author?.firstName?.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        article.author?.lastName?.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(article)
      }

      this.articles = results

      if (results.length === 0 || !key) {
        this.getArticles()
        console.log("GetArticles Called")
      }
    }

    console.log("searchArticles", results)
  }

  ngOnInit(): void {
    this.getArticles();
  }
}
