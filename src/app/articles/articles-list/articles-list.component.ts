import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Article, Tag } from '../article.model';
import { ArticleService } from '../article.service';
import { MatDialog } from '@angular/material/dialog'
import { ArticleEntryPopupComponent } from '../article-entry-popup/article-entry-popup.component';
import { Router } from '@angular/router';

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
  public newArticle!: Article;

  constructor(
    private seo: SeoService,
    private articleService: ArticleService,
    private dialogRef: MatDialog,
    private router: Router
  ) { }

  navigateTo(value: any): void {
    this.router.navigate(['../', value])
  }

  openArticleEntryDialog(): void {
    const dialogRef = this.dialogRef.open(ArticleEntryPopupComponent, {
      width: '800px',
      // height: '500px',
      data: {
        title: 'New Article Title',
        placeholder: 'Enter your title here'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.createArticle(result).subscribe(
          (response: Article) => {
            this.newArticle = response;

            this.router.navigateByUrl('article-entry-edit')
            console.log('Successfully sent a request to create an article')
            console.log('New ARticle', response)
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        )
      }
    });
  }

  public fetchArticles(): void {
    this.articleService.getArticles(this.pageNumber, this.pageItemsLimit).subscribe(
      (response: Article[]) => {
        this.articles = response;
        this.tagList = response[0].tags
        this.calcReadingTime(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
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
        this.fetchArticles()
        console.log("fetchArticles Called")
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
        this.fetchArticles()
        console.log("fetchArticles Called")
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
        this.fetchArticles()
        console.log("fetchArticles Called")
      }
    }

    console.log("searchArticles", results)
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
