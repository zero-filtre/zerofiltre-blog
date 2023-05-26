import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { DeleteArticlePopupComponent } from 'src/app/articles/delete-article-popup/delete-article-popup.component';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { calcReadingTime, capitalizeString, nFormatter } from '../../services/utilities.service';
import { ArticleEntryPopupComponent } from '../../articles/article-entry-popup/article-entry-popup.component';
import { MessageService } from 'src/app/services/message.service';
import { User } from 'src/app/user/user.model';

@Component({
  selector: 'app-base-article-list',
  templateUrl: './base-article-list.component.html',
  styleUrls: ['./base-article-list.component.css']
})
export class BaseArticleListComponent implements OnInit {
  articles!: Article[];

  PUBLISHED = 'published';
  DRAFT = 'draft';
  IN_REVIEW = 'in_review';

  notEmptyArticles = true;
  notScrolly = true;
  lastPage!: number;
  loadingMore = false;
  hasNext!: boolean;
  scrollyPageNumber = 0;

  pageNumber: number = 0;
  pageItemsLimit: number = 5;

  loading = false;
  errorMessage = '';

  activePage: string = this.PUBLISHED;
  mainPage = true;

  subscription$!: Subscription;
  status!: string;

  sponsorContentUrl = '/cours/1';
  sponsorContentImageUrl = 'https://ik.imagekit.io/lfegvix1p/ddd-imagee_7A342RNOT.svg?updatedAt=1681558221642';

  constructor(
    public loadEnvService: LoadEnvService,
    public seo: SeoService,
    public articleService: ArticleService,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public translate: TranslateService,
    public navigate: NavigationService,
    public dialogEntryRef: MatDialog,
    public dialogDeleteRef: MatDialog,
    public messageService: MessageService,
    @Inject(PLATFORM_ID) public platformId: any
  ) { }

  setArticlesReadingTime(articles: Article[]): void {
    for (const article of articles) {
      calcReadingTime(article);
    }
  }

  isAuthor(user: any, article: Article): boolean {
    return user?.id === article?.author?.id
  }

  openArticleEntryDialog(): void {
    const currUser = this.authService.currentUsr as User;
    const loggedIn = !!currUser;

    if (!loggedIn) {
      this.router.navigate(
        ['/login'],
        {
          relativeTo: this.route,
          queryParams: { redirectURL: this.router.url, articleDialog: true },
          queryParamsHandling: 'merge',
        });

      this.messageService.openSnackBarInfo('Veuillez vous connecter pour rédiger un article 🙂', 'OK');

      return;
    }

    this.dialogEntryRef.open(ArticleEntryPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        router: this.router
      }
    });
  }

  openArticleDeleteDialog(articleId: number | undefined): void {
    this.dialogDeleteRef.open(DeleteArticlePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: articleId,
        history: this.router.url
      }
    });
  }

  onScroll() {
    if (this.notScrolly && this.notEmptyArticles && this.hasNext) {
      this.loadingMore = true;
      this.notScrolly = false;
      this.fetchMoreArticles();
    }
  }

  fetchMoreArticles(): any {
    // do nothing
  }

  handleFetchNewArticles({ content, hasNext }: any) {
    const newArticles = [...content];
    this.loadingMore = false;
    this.hasNext = hasNext;
    this.setArticlesReadingTime(newArticles);

    if (newArticles.length === 0) {
      this.notEmptyArticles = false;
    }

    this.articles = this.articles.concat(newArticles);
    this.notScrolly = true;
  }

  handleFetchedArticles = {
    next: ({ content, hasNext }: any) => {
      this.articles = content;
      this.setArticlesReadingTime(this.articles);

      this.loading = false;
      this.hasNext = hasNext;

      if (this.articles.length === 0) {
        this.errorMessage = 'Aucun article trouvé 😊!';
      }
    },
    error: (_error: HttpErrorResponse) => {
      this.loading = false;
      this.hasNext = false;
      this.articles = [];
      this.errorMessage = "Oops... une erreur s'est produite!";
    },
  };

  nFormater(totalReactions: number): string {
    return nFormatter(totalReactions);
  }

  capitalize(str: string): string {
    return capitalizeString(str);
  }

  ngOnInit(): void {
    // do nothing.
  }

}
