import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private durationLimit = 5;
  private defaultHorizontalPosition = 'right'
  private defaultVerticalPosition = 'bottom'
  private OK = 'OK';

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) { }

  private openSnackBar(message: string, action: string, className: string, type: string, duration: number, hoPosition: any) {
    this.snackBar.open(message, action, {
      horizontalPosition: hoPosition,
      verticalPosition: this.defaultVerticalPosition as any,
      duration: duration * 1000,
      panelClass: [className, type],
    });
  }

  public openSnackBarSuccess(message: string, action: string, duration = this.durationLimit, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'success-snackbar', 'success', duration, hoPosition)
  }
  public openSnackBarError(message: string, action: string, duration = this.durationLimit, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'error-snackbar', 'error', duration, hoPosition)
  }
  public openSnackBarWarning(message: string, action: string, duration = this.durationLimit, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'warning-snackbar', 'error', duration, hoPosition)
  }
  public openSnackBarInfo(message: string, action: string, duration = this.durationLimit, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'info-snackbar', 'info', duration, hoPosition)
  }

  public cancel() {
    this.snackBar.dismiss();
  }

  // For non authenticated requests
  authError(state: any) {
    const msg = this.translate.instant('login.authErrorMessage')
    this.openSnackBarError(msg, this.OK);
    this.router.navigate(['/login'], { queryParams: { 'redirectURL': state.url } });
  }

  // When user is already logged In
  loggedInAuthError() {
    this.router.navigateByUrl('/');
  }

  // When logging In
  loginError() {
    const msg = this.translate.instant('login.loginFailedMessage');
    this.openSnackBarError(msg, this.OK);
  }

  loadUserFailed() {
    const msg = this.translate.instant('login.loadUserFailedMessage');
    this.openSnackBarError(msg, this.OK);
  }

  // If not the author
  authorRouteError() {
    const msg = this.translate.instant('app.authorRouteError');
    this.openSnackBarError(msg, this.OK);
    this.router.navigateByUrl('/');
  }

  // Email notification on signup success
  signUpSuccess() {
    const msg = this.translate.instant('signup.signUpSuccessMessage');
    this.openSnackBarSuccess(msg, this.OK);
  }

  saveArticleError() {
    const msg = this.translate.instant('articleEntryEdit.saveFailedMessage');
    this.openSnackBarError(msg, this.OK);
  }

  autoSaveAlert() {
    const msg = this.translate.instant('articleEntryEdit.autoSaveAlertMessage');
    this.openSnackBarWarning(msg, "C'est noté !")
  }

  saveArticleSuccess() {
    const msg = this.translate.instant('articleEntryEdit.saveSuccessMessage');
    this.openSnackBarSuccess(msg, this.OK);
  }

  publishArticleSuccess() {
    const msg = this.translate.instant('articleEntryEdit.publishSuccessMessage');
    this.openSnackBarSuccess(msg, this.OK);
  }

  resendConfirmationSuccess() {
    const msg = this.translate.instant('resendConfirmation.resendConfirmationSuccessMesssage');
    this.openSnackBarSuccess(msg, this.OK);
  }

  updateProfileSuccess() {
    const msg = this.translate.instant('profile.updateSuccessMessage');
    this.openSnackBarSuccess(msg, this.OK);
  }

  badSocialLinksFormat() {
    const msg = this.translate.instant('profileEdit.invalidSocialLinkMessage');
    this.openSnackBarWarning(msg, this.OK);
  }

  fileSizeWarning(maxSize: number) {
    const msg = this.translate.instant('fileUpload.sizeWarningMessage');
    this.openSnackBarWarning(`La taille de fichier maximum est limitée à ${maxSize}MB !`, this.OK)
  }

  fileTypeWarning() {
    const msg = this.translate.instant('fileUpload.typeWarningMessage');
    this.openSnackBarWarning(msg, this.OK)
  }

  fileUploadAuthError() {
    const msg = this.translate.instant('fileUpload.AuthError');
    this.openSnackBarError(msg, this.OK);
  }

  codeCopied() {
    const msg = this.translate.instant('app.codeCopied');
    this.openSnackBarInfo(msg, '', 1, 'center');
  }
}
