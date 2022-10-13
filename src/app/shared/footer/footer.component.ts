import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { capitalizeString, getCurrentYear } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public currentYear!: number;
  public recentArticles$!: Observable<Article[]>;

  readonly servicesUrl = environment.servicesUrl;

  constructor(
    private loadEnvService: LoadEnvService,
    private articleService: ArticleService,
  ) { }

  public loadCurrentYear() {
    this.currentYear = getCurrentYear();
  }

  public capitalize(str: string): string {
    return capitalizeString(str);
  }

  ngOnInit(): void {
    this.loadCurrentYear();

    this.recentArticles$ = this.articleService.findAllArticleByFilter(0, 5)
      .pipe(
        map(({ content }: any) => {
          return content;
        }),
        // tap(console.log)
      )
  }

}
