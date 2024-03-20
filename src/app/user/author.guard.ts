import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ArticleService } from '../articles/article.service';
import { LoadEnvService } from '../services/load-env.service';
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
    private loadEnvService: LoadEnvService,
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
    this.articleId = route.params.id?.split('-')[0]

    return this.articleService.canEditArticle(this.currentUsrId, this.articleId, this.isAdminUser)
      .pipe(
        tap((canEdit) => {
          if (!canEdit) {
            this.messageService.authorRouteError();
          }
        })
      )
  }
}
