import { Component, Input } from '@angular/core';
import { Article } from '../article.model';
import { AuthService } from 'src/app/user/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteArticlePopupComponent } from '../delete-article-popup/delete-article-popup.component';
import { Router } from '@angular/router';
import { capitalizeString, nFormatter } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-articles-card',
  templateUrl: './articles-card.component.html',
  styleUrls: ['./articles-card.component.css']
})
export class ArticlesCardComponent {

  @Input() article: Article;

  constructor(

    public dialogDeleteRef: MatDialog,
    public authService: AuthService,
    public router: Router,
  ) { }

  

  isAuthor(user: any, article: Article): boolean {
    return user?.id === article?.author?.id
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
nFormater(totalReactions: number): string {
  return nFormatter(totalReactions);
}

capitalize(str: string): string {
  return capitalizeString(str);
}
}
