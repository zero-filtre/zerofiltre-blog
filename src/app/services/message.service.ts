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
  public autoSaveAlertMessage!: string;


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
    this.openSnackBar(message, action, 'success-snackbar', 'success', duration)
  }
  public openSnackBarError(message: string, action: string, duration = this.durationLimit) {
    this.openSnackBar(message, action, 'error-snackbar', 'error', duration)
  }
  public openSnackBarWarning(message: string, action: string, duration = this.durationLimit) {
    this.openSnackBar(message, action, 'warning-snackbar', 'error', duration)
  }

  public cancel() {
    this.snackBar.dismiss();
  }

  // For non authenticated requests
  authError(state: any) {
    this.openSnackBarError('Veuillez Vous  connecter !', '');
    this.router.navigate(['/login'], { queryParams: { 'redirectURL': state.url } });
  }

  // When user is already logged In
  loggedInAuthError() {
    this.router.navigateByUrl('/');
  }

  // When logging In
  loginError() {
    this.openSnackBarError('Email ou mot de passe incorrect !', '');
  }

  // If not the author
  authorRoleError() {
    this.openSnackBarError('Vous ne pouvez pas acceder à cette page!', '');
    this.router.navigateByUrl('/');
  }

  // Email notification on signup success
  signUpSuccess() {
    this.openSnackBarSuccess('Un email de validation de compte vous a été envoyé, veuillez consulter votre boite mail', 'Ok', 0);
  }

  saveArticleError() {
    this.openSnackBarError('La sauvegarde a echoué !', '');
  }

  autoSaveAlert() {
    const msg = 'Hello Bao, surtout veille à renseigner tous les champs obligatoires pour assurer la sauvegarde automatique de ton article'
    this.openSnackBarWarning(msg, "C'est noté !", 0)
  }

  saveArticleSuccess() {
    this.openSnackBarSuccess('Article sauvegardé !', 'OK');
  }

  publishArticleSuccess() {
    this.openSnackBarSuccess('Article pulié avec success !', 'OK');
  }

  resendConfirmationSuccess() {
    const msg = 'Un email avec un lien de confirmation de compte a été envoyé dans votre boite mail'
    this.openSnackBarSuccess(msg, 'OK', 0);
  }

  updateProfileSuccess() {
    this.openSnackBarSuccess('Enregistrement reussi !', 'OK', 0);
  }

  fileSizeWarning(maxSize: number) {
    this.openSnackBarWarning(`La taille de fichier maximum est limitée à ${maxSize}MB !`, 'OK', 0)
  }

  fileTypeWarning() {
    this.openSnackBarWarning('Veuillez ajouter un fichier image svp !', 'OK', 0)
  }

  fileUploadAuthError() {
    this.openSnackBarError('Oups..😢 Une erreur est survenue, veuillez rafraichir cette page !', 'OK', 0);
  }
}
