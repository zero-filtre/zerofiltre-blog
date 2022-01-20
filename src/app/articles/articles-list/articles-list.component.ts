import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Article, Tag } from '../article.model';
import { ArticleService } from '../article.service';
import { MatDialog } from '@angular/material/dialog'
import { ArticleEntryPopupComponent } from '../article-entry-popup/article-entry-popup.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent implements OnInit {
  public articles!: Article[];
  public tagList!: Tag[];
  public pageNumber: number = 0;
  public pageItemsLimit: number = 5;
  public activePage: string = 'recent'

  constructor(
    private seo: SeoService,
    private articleService: ArticleService,
    private dialogRef: MatDialog,
    private router: Router,
    private location: Location
  ) { }

  openArticleEntryDialog(): void {
    this.dialogRef.open(ArticleEntryPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      // backdropClass: 'article-popup-backdrop',
      data: {
        router: this.router
      }
    });
  }

  public fetchArticles(): void {
    this.articleService.getArticles(this.pageNumber, this.pageItemsLimit).subscribe({
      next: (response: Article[]) => {
        // this.articles = response
        this.articles = this.sortByDate(response).filter((item: Article) => item.status === 'PUBLISHED')
        this.tagList = response[0].tags
        this.calcReadingTime(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    });
  }

  public getSavedArticles() {
    this.articleService.getArticles(this.pageNumber, this.pageItemsLimit).subscribe({
      next: (response: Article[]) => {
        this.articles = response.filter((item: Article) => item.status === 'DRAFT')
        this.tagList = response[0].tags
        this.calcReadingTime(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    });
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

  public sortBy(trendName: string): void {
    let results: Article[] = [];

    if (trendName === 'recent') {
      this.activePage = 'recent';
      results = this.sortByDate(this.articles);
      this.articles = results;
      this.location.go(this.router.url)
    }

    if (trendName === 'popular') {
      this.activePage = 'popular'
      results = this.sortByPopularity(this.articles);
      this.articles = results;
      this.location.go(`${this.router.url}?sortBy=${trendName}`)
    }

    if (trendName === 'trending') {
      this.activePage = 'trending'
      results = this.sortByTrend(this.articles);
      this.articles = results;
      this.location.go(`${this.router.url}?sortBy=${trendName}`)
    }
  }

  private sortByDate(list: Article[]): Article[] {
    return list
      .sort((a: any, b: any) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
  }

  private sortByPopularity(list: Article[]): Article[] {
    return list
  }

  private sortByTrend(list: Article[]): Article[] {
    return list
  }

  public sortByTag(tagName: any): void {
    const results: Article[] = []

    for (const article of this.articles) {
      if (article.tags?.some(tag => tag.name?.toLowerCase().indexOf(tagName.toLowerCase()) !== -1)) {
        results.push(article)
      }

      this.articles = results

      if (results.length === 0) {
        this.fetchArticles()
      }
    }

    this.location.go(`${this.router.url}?tag=${tagName}`)
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
        this.fetchArticles()
      }
    }
  }

  ngOnInit(): void {
    this.seo.generateTags({
      title: 'Tous les articles | Zerofiltre.tech',
      description: "Développez des Apps à valeur ajoutée pour votre business et pas que pour l'IT. Avec Zerofiltre, profitez d'offres taillées pour chaque entreprise. Industrialisez vos Apps. Maintenance, extension, supervision.",
      author: 'Zerofiltre.tech',
      type: 'website',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });

    this.fetchArticles();
  }
}
