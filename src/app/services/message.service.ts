import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private defaultHorizontalPosition = 'right'
  private defaultVerticalPosition = 'top'
  private OK = 'OK';
  
  DURATION_DEFAULT = 8;

  DURATION_SUCCESS = this.DURATION_DEFAULT;
  DURATION_WARNING = 10;
  DURATION_INFO = this.DURATION_DEFAULT;
  DURATION_ERROR = this.DURATION_DEFAULT;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private modalService: ModalService
  ) { }

  private openSnackBar(message: string, action: string, className: string, type: string, duration: number, vtPosition: any, hoPosition: any) {
    this.snackBar.open(message, action, {
      horizontalPosition: hoPosition,
      verticalPosition: vtPosition,
      duration: duration * 1000,
      panelClass: [className, type],
    });

  }

  public openSnackBarSuccess(message: string, action: string, duration = this.DURATION_SUCCESS, vtPosition = this.defaultVerticalPosition, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'success-snackbar', 'success', duration, vtPosition, hoPosition)
  }

  public openSnackBarError(message: string, action: string, duration = this.DURATION_ERROR, vtPosition = this.defaultVerticalPosition, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'error-snackbar', 'error', duration, vtPosition, hoPosition)
  }

  public openSnackBarWarning(message: string, action: string, duration = this.DURATION_WARNING, vtPosition = this.defaultVerticalPosition, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'warning-snackbar', 'error', duration, vtPosition, hoPosition)
  }

  public openSnackBarInfo(message: string, action: string, duration = this.DURATION_INFO, vtPosition = this.defaultVerticalPosition, hoPosition = this.defaultHorizontalPosition) {
    this.openSnackBar(message, action, 'info-snackbar', 'info', duration, vtPosition, hoPosition)
  }

  public cancel() {
    this.snackBar.dismiss();
  }

  // For expired session
  sessionExpired(state: any) {
    this.openSnackBarError('Votre session est expirée ! Veuillez vous reconnecter.', 'OK');

    this.router.navigate(
      ['/login'],
      {
        relativeTo: state,
        queryParams: { redirectURL: state.url },
        queryParamsHandling: 'merge',
      });
  }

  // For non authenticated requests
  authError(message = this.translate.instant('login.authErrorMessage')) {
    this.openSnackBarError(message, this.OK);
  }

  // When a route/module is not allowed
  loadModuleError() {
    this.router.navigateByUrl('**');
  }

  // When user is already logged In
  loggedInAuthError() {
    this.router.navigateByUrl('/cours');
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
    this.router.navigateByUrl('/cours');
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

  autoSaveAlert(arg = false) {
    // const msg = this.translate.instant('articleEntryEdit.autoSaveAlertMessage');
    // this.openSnackBarWarning("Vos changement seront perdu !, souhaittez vous quiter cette page ?", "Quitter", 0)
    // return false;

    if (arg == false) {
      let snackBarRef = this.snackBar.open("Vos changement seront perdu ! souhaittez vous quiter cette page ?", "Quitter", { duration: 0 });

      snackBarRef.onAction().subscribe(() => {
        this.autoSaveAlert(true);
      });
    }

    return arg;
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
    this.openSnackBarSuccess(msg, this.OK, 10);
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
