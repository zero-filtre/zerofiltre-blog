import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { Article } from '../articles/article.model';
import { ArticleService } from '../articles/article.service';
import { Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private durationLimit = 3;

  constructor(
    private snackBar: MatSnackBar,
    private articleService: ArticleService,
    private router: Router
  ) { }

  private openSnackBar(message: string, action: string, className: string, type: string, duration: number) {
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: duration * 1000,
      panelClass: [className, type],
    });
  }

  public openSnackBarSuccess(message: string, action: string, duration = this.durationLimit) {
    this.openSnackBar(message, action, 'green-snackbar', 'success', duration)
  }
  public openSnackBarError(message: string, action: string, duration = this.durationLimit) {
    this.openSnackBar(message, action, 'red-snackbar', 'error', duration)
  }

  // For non authenticated requests
  authError(state: RouterStateSnapshot) {
    this.openSnackBarError('Veuillez Vous  connecter !', 'OK');
    this.router.navigate(['/login']);

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
        )
      )
      .subscribe();
  }

  // When logging In
  loginError() {
    this.openSnackBarError('Email ou mot de passe incorrect !', 'Ok');

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(
        tap(_ =>
          this.router.navigate(['/login'])
        )
      )
      .subscribe();
  }

  // Email notification on signup success
  signUpSuccess() {
    this.openSnackBarSuccess('Un email de validation de compte vous a été envoyé, veuillez consulter votre boite mail', 'Ok', 0);
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
