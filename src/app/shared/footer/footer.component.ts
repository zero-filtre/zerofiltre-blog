import { Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { getCurrentYear } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public currentYear!: number;
  public recentArticles$!: Observable<Article[]>;

  constructor(
    private articleService: ArticleService,
  ) { }

  public loadCurrentYear() {
    this.currentYear = getCurrentYear();
  }

  ngOnInit(): void {
    this.loadCurrentYear();

    this.recentArticles$ = this.articleService.findAllRecentArticles(0, 5)
      .pipe(
        map(({ content }: any) => {
          return content;
        }),
        // tap(console.log)
      )
  }

}
