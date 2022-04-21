import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, pipe, tap } from 'rxjs';
import { Article } from '../articles/article.model';
import { ArticleService } from '../articles/article.service';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorGuard implements CanActivate {
  currentUsrId!: string;
  currentArticleAuthorId!: string;
  isAdminUser!: boolean;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private articleService: ArticleService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.isAdminUser = this.authService.isAdmin;
    this.currentUsrId = this.authService?.currentUsr?.id;

    this.articleService
      .findArticleById(route.params.id)
      .subscribe(
        (article: Article) =>
          (this.currentArticleAuthorId = article?.author?.id!)
      );

    if (this.currentUsrId === this.currentArticleAuthorId || this.isAdminUser) {
      return true;
    } else {
      this.messageService.authorRoleError();
      return false;
    }
  }
}
