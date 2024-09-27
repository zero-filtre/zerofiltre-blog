import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../user/user.model';
import { AddEmailPopupComponent } from '../shared/add-email-popup/add-email-popup.component';
import { SearchPopupComponent } from '../shared/search-popup/search-popup.component';
import { LoginModalComponent } from '../shared/login-modal/login-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SignupModalComponent } from '../shared/signup-modal/signup-modal.component';
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private dialogRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  checkUserEmail(user: User) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = regex.test(user.email!);

    if (validEmail) {
      return;
    } else {
      this.openEmailModal();
    }
  }

  private openEmailModal() {
    this.dialogRef.open(AddEmailPopupComponent, {
      panelClass: 'popup-panel',
      disableClose: true,
    });
  }

  public openSearchModal() {
    this.dialogRef.open(SearchPopupComponent, {
      panelClass: 'popup-search',
      backdropClass: 'popup-search-overlay',
      disableClose: false,
      minHeight: '400px',
      width: '700px',
    });
  }

  public toggleSearchModal(isOpen: boolean) {
    if (isOpen) {
      this.openSearchModal();
    } else {
      this.dialogRef.closeAll();
    }
  }

  public openLoginModal() {
    this.dialogRef.open(LoginModalComponent, {
      panelClass: 'popup-login',
      width: '500px',
    });
  }

  public openSignUpModal() {
    this.dialogRef.open(SignupModalComponent, {
      panelClass: 'popup-login',
      width: '500px',
    });
  }
}
