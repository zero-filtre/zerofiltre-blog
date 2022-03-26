import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteAccountPopupComponent } from '../delete-account-popup/delete-account-popup.component';
import { PasswordUpdatePopupComponent } from '../password-update-popup/password-update-popup.component';
import { ProfileImagePopupComponent } from '../profile-image-popup/profile-image-popup.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private dialogRef: MatDialog,
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

  ngOnInit(): void {
  }

}
