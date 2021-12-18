import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {
  public  articles!: Article[];

  name = environment.username;

  constructor(private articleService: ArticleService) {}

  public getArticles(): void {
    this.articleService.getArticles().subscribe(
      (response: Article[]) => {
        this.articles = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  ngOnInit(): void {
    this.getArticles()
  }

}
