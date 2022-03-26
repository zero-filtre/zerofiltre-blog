import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../auth.service';
import { DeleteAccountPopupComponent } from '../delete-account-popup/delete-account-popup.component';
import { PasswordUpdatePopupComponent } from '../password-update-popup/password-update-popup.component';
import { ProfileImagePopupComponent } from '../profile-image-popup/profile-image-popup.component';
import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: User;
  loading!: boolean;

  constructor(
    private dialogRef: MatDialog,
    public authService: AuthService,
    private messageService: MessageService
  ) { }

  public openPasswordEntryDialog(): void {
    this.dialogRef.open(PasswordUpdatePopupComponent, {
      panelClass: 'password-popup-panel',
      // backdropClass: 'password-popup-backdrop',
    });
  }

  public openAccountDeleteDialog(): void {
    this.dialogRef.open(DeleteAccountPopupComponent, {
      panelClass: 'delete-account-popup-panel',
      // backdropClass: 'delete-account-popup-backdrop',
    });
  }

  public openProfileImageDeleteDialog(): void {
    this.dialogRef.open(ProfileImagePopupComponent, {
      panelClass: 'profile-image-popup-panel',
      // backdropClass: 'profile-image-popup-backdrop',
    });
  }

  public resendConfirmationMail() {
    this.loading = true;
    this.authService.resendUserConfirm(this.user?.email!).subscribe({
      next: (response: any) => {
        const msg = 'Un mail avec un lien de confirmation de compte a été envoyé dans votre boite mail'
        this.messageService.openSnackBarSuccess(msg, 'Ok', 0);
        this.loading = false;
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr
  }

}
