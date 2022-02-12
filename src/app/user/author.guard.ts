import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Article } from '../articles/article.model';
import { ArticleService } from '../articles/article.service';
import { MessageService } from '../services/message.service';
import { AuthService } from './auth.service';

class Permissions {
  canActivate(user: AuthService, id: string): boolean {
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthorGuard implements CanActivate {
  private isAuthor = true;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private articleService: ArticleService
    // private permissions: Permissions
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.articleService.getOneArticle(route.params.id).subscribe({
      next: (response: Article) => {
        console.log('ROUTING ARTICLE DETAILS: ', response);
        this.authService.user$.subscribe({
          next: (usr: any) => {
            this.isAuthor = usr.sub === response?.author?.email;
            console.log('ROUTING USER: ', usr);
            console.log('IS AUTHOR: ', this.isAuthor);
          }
        })
      }
    })

    console.log('IS AUTHOR 2: ', this.isAuthor);

    // if (!isAuthor) {
    //   this.messageService.authorRoleError();
    // }
    return this.isAuthor;
    // return this.permissions.canActivate(this.authService.token, route.params.id);
  }

}
