import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Article } from '../articles/article.model';
import { ArticleService } from '../articles/article.service';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private articleService: ArticleService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isLoggedIn$
      .pipe(
        tap(_loggedIn => {
          this.articleService.getOneArticle(route.params.id).subscribe({
            next: (response: Article) => {
              this.authService.user$.subscribe({
                next: (currUsr: any) => {
                  if (
                    currUsr?.sub !== response?.author?.email
                    // || currUsr?.email !== response?.author?.email
                    // || currUsr?.email !== response?.author?.email
                    // || currUsr?.id !== response?.author?.id
                    // || currUsr?.items[0].user_id !== response?.author?.id
                    // || currUsr?.items[0].account_id !== response?.author?.id
                  ) {
                    console.log('ROUTE CHECK CURR USER: ', currUsr);
                    console.log('ROUTE CHECK CURR ARTICLE: ', response);
                    this.messageService.authorRoleError();
                  }
                }
              })
            }
          })
        }),
      )

    // return this.permissions.canActivate(this.authService, route.params.id);
  }

}
