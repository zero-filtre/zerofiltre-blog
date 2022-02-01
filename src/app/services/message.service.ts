import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { Article } from '../articles/article.model';
import { ArticleService } from '../articles/article.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private durationLimit = 4;

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
  authError() {
    this.openSnackBarError('Veuillez Vous  connecter !', '');
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

  // Email notification on signup success
  signUpSuccess() {
    this.openSnackBarSuccess('Un email de validation de compte vous a été envoyé, veuillez consulter votre boite mail', 'Ok', 0);
  }

  saveArticleError(formValue: Article) {
    this.openSnackBarError('La sauvegarde a echoué !', 'Reessayer');

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(
        tap(_ => this.articleService.updateToSave(formValue))
      )
      .subscribe();
  }

  /**
   * 
    private setCustomErrorMessage(error: HttpErrorResponse, customErrorMessage: string): string {
      let errorMessage = "Un problème est survenu, merci d'essayer de nouveau plus tard ou de contacter un administrateur de l'API";
      console.log('ERROR: ', error);

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        if (error.status !== 0) {
          let serverErrorExist = !!error?.error?.error

          if (serverErrorExist) {
            errorMessage = customErrorMessage;
          } else {
            errorMessage = errorMessage;
          }
        }
      }

      return errorMessage;
    }
  */
}
