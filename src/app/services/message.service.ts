import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { Article } from '../articles/article.model';
import { ArticleService } from '../articles/article.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private snackBar: MatSnackBar,
    private articleService: ArticleService,
    private router: Router
  ) { }

  private openSnackBar(message: string, action: string, className: string, type: string) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 5000,
      panelClass: [className, type],
    });
  }

  public openSnackBarSuccess(message: string, action: string) {
    this.openSnackBar(message, action, 'green-snackbar', 'success')
  }
  public openSnackBarError(message: string, action: string) {
    this.openSnackBar(message, action, 'red-snackbar', 'error')
  }

  // For non authenticated requests
  authError() {
    this.openSnackBarError('Veuillez Vous  connecter !', 'OK');
    this.router.navigate(['/login']);

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/login'])
        )
      )
      .subscribe();
  }

  // When logging In
  loginError() {
    this.openSnackBarError('Email ou mot de passe incorrect !', '');

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/login'])
        )
      )
      .subscribe();
  }

  saveArticleError(formValue: Article) {
    this.openSnackBarError('La sauvegarde a echoué', 'Reessayer');

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(
        tap(_ => this.articleService.updateToSave(formValue))
      )
      .subscribe();
  }
}
