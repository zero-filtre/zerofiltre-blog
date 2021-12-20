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

  public sortBy(filterName: string): void {
    this.articles = [{ title: 'un article qui a ete filtre' }]
  }

  ngOnInit(): void {
    this.getArticles();
  }
}
