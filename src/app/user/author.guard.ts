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
  articleId!: string;
  isAdminUser!: boolean;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private articleService: ArticleService
  ) { }

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
    this.articleId = route.params.id

    return this.articleService.canEditArticle(this.currentUsrId, this.articleId, this.isAdminUser)
      .pipe(
        tap((canEdit) => {
          if (!canEdit) {
            console.log('CAN-EDIT: ', canEdit)
            this.messageService.authorRoleError();
          }
        })
      )
  }
}
