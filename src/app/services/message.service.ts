import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from './modal.service';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface NotificationConfig extends MatSnackBarConfig {
  message: string;
  action?: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly modalService = inject(ModalService);

  // Durées par défaut en secondes
  private readonly DEFAULT_DURATION = 5;
  private readonly WARNING_DURATION = 8;

  // Configuration par défaut
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: this.DEFAULT_DURATION * 1000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
    panelClass: [],
  };

  /**
   * Affiche une notification avec la configuration spécifiée
   */
  private showNotification(config: NotificationConfig): void {
    const finalConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...config,
      panelClass: [`${config.type}-snackbar`, ...(config.panelClass || [])],
    };

    this.snackBar.open(config.message, config.action || 'OK', finalConfig);
  }

 
  public showSuccess(
    message: string,
    action?: string,
    duration = this.DEFAULT_DURATION
  ): void {
    this.showNotification({
      message,
      action,
      duration: duration * 1000,
      type: NotificationType.SUCCESS,
    });
  }

  public showError(
    message: string,
    action?: string,
    duration = this.DEFAULT_DURATION
  ): void {
    this.showNotification({
      message,
      action,
      duration: duration * 1000,
      type: NotificationType.ERROR,
    });
  }

  public showWarning(
    message: string,
    action?: string,
    duration = this.WARNING_DURATION
  ): void {
    this.showNotification({
      message,
      action,
      duration: duration * 1000,
      type: NotificationType.WARNING,
    });
  }

  public showInfo(
    message: string,
    action?: string,
    duration = this.DEFAULT_DURATION
  ): void {
    this.showNotification({
      message,
      action,
      duration: duration * 1000,
      type: NotificationType.INFO,
    });
  }

  public cancel(): void {
    this.snackBar.dismiss();
  }

  // Méthodes spécifiques pour les cas d'usage courants

  /**
   * Gestion de l'expiration de session
   */
  public sessionExpired(state: any): void {
    this.showError('Votre session est expirée ! Veuillez vous reconnecter.');
    this.router.navigate(['/login'], {
      relativeTo: state,
      queryParams: { redirectURL: state.url },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Erreur d'authentification
   */
  public authError(
    message = this.translate.instant('login.authErrorMessage')
  ): void {
    this.showError(message);
  }

  /**
   * Erreur de chargement de module
   */
  public loadModuleError(): void {
    this.router.navigateByUrl('**');
  }

  /**
   * Utilisateur déjà connecté
   */
  public loggedInAuthError(): void {
    this.router.navigateByUrl('/cours');
  }

  /**
   * Erreur de connexion
   */
  public loginError(): void {
    const msg = this.translate.instant('login.loginFailedMessage');
    this.showError(msg);
  }

  /**
   * Erreur de chargement utilisateur
   */
  public loadUserFailed(): void {
    const msg = this.translate.instant('login.loadUserFailedMessage');
    this.showError(msg);
  }

  /**
   * Erreur d'accès auteur
   */
  public authorRouteError(): void {
    const msg = this.translate.instant('app.authorRouteError');
    this.showError(msg);
    this.router.navigateByUrl('/cours');
  }

  /**
   * Succès inscription
   */
  public signUpSuccess(): void {
    const msg = this.translate.instant('signup.signUpSuccessMessage');
    this.showSuccess(msg);
  }

  /**
   * Erreur sauvegarde article
   */
  public saveArticleError(): void {
    const msg = this.translate.instant('articleEntryEdit.saveFailedMessage');
    this.showError(msg);
  }

  /**
   * Alerte sauvegarde automatique
   */
  public autoSaveAlert(confirmed = false): boolean {
    if (!confirmed) {
      const snackBarRef = this.snackBar.open(
        'Vos changements seront perdus ! Souhaitez-vous quitter cette page ?',
        'Quitter',
        { duration: 0 }
      );

      snackBarRef.onAction().subscribe(() => {
        this.autoSaveAlert(true);
      });
    }
    return confirmed;
  }

  /**
   * Succès sauvegarde article
   */
  public saveArticleSuccess(): void {
    const msg = this.translate.instant('articleEntryEdit.saveSuccessMessage');
    this.showSuccess(msg);
  }

  /**
   * Succès publication article
   */
  public publishArticleSuccess(): void {
    const msg = this.translate.instant(
      'articleEntryEdit.publishSuccessMessage'
    );
    this.showSuccess(msg);
  }

  /**
   * Succès renvoi confirmation
   */
  public resendConfirmationSuccess(): void {
    const msg = this.translate.instant(
      'resendConfirmation.resendConfirmationSuccessMesssage'
    );
    this.showSuccess(msg, undefined, 10);
  }

  /**
   * Succès mise à jour profil
   */
  public updateProfileSuccess(): void {
    const msg = this.translate.instant('profile.updateSuccessMessage');
    this.showSuccess(msg);
  }

  /**
   * Format liens sociaux invalide
   */
  public badSocialLinksFormat(): void {
    const msg = this.translate.instant('profileEdit.invalidSocialLinkMessage');
    this.showWarning(msg);
  }

  /**
   * Avertissement taille fichier
   */
  public fileSizeWarning(maxSize: number): void {
    this.showWarning(
      `La taille de fichier maximum est limitée à ${maxSize}MB !`
    );
  }

  /**
   * Avertissement type fichier
   */
  public fileTypeWarning(): void {
    const msg = this.translate.instant('fileUpload.typeWarningMessage');
    this.showWarning(msg);
  }

  /**
   * Erreur authentification upload fichier
   */
  public fileUploadAuthError(): void {
    const msg = this.translate.instant('fileUpload.AuthError');
    this.showError(msg);
  }

  /**
   * Code copié
   */
  public codeCopied(): void {
    const msg = this.translate.instant('app.codeCopied');
    this.showInfo(msg, '', 1);
  }
}
