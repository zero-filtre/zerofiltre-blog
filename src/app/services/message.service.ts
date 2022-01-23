import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { Article } from '../articles/article.model';
import { ArticleService } from '../articles/article.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private snackBar: MatSnackBar, private articleService: ArticleService) { }

  private openSnackBar(message: string, action: string, cssClass: string, type: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 5000,
      panelClass: [cssClass, type],
    });
  }

  public openSnackBarSuccess(message: string, action: string) {
    this.openSnackBar(message, action, 'green-snackbar', 'success')
  }

  private openSnackBarError(message: string, action: string) {
    this.openSnackBar(message, action, 'red-snackbar', 'error')
  }

  saveArticleError(formValue: Article) {
    this.openSnackBarError('La sauvegarde a echoué', 'Reessayer');

    return this.snackBar._openedSnackBarRef?.onAction().pipe(tap(_ => this.articleService.updateToSave(formValue))).subscribe();
  }
}
