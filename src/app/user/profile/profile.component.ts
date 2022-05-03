import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../auth.service';
import { DeleteAccountPopupComponent } from '../delete-account-popup/delete-account-popup.component';
import { PasswordUpdatePopupComponent } from '../password-update-popup/password-update-popup.component';
import { ProfileImagePopupComponent } from '../profile-image-popup/profile-image-popup.component';
import { User } from '../user.model';
import { SeoService } from 'src/app/services/seo.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user!: User;
  public user$!: Subscription;
  public loading!: boolean;

  constructor(
    private dialogRef: MatDialog,
    private seo: SeoService,
    public authService: AuthService,
    private messageService: MessageService,
    private translate: TranslateService
  ) { }

  public openPasswordEntryDialog(): void {
    this.dialogRef.open(PasswordUpdatePopupComponent, {
      panelClass: 'password-popup-panel',
    });
  }

  public openAccountDeleteDialog(): void {
    this.dialogRef.open(DeleteAccountPopupComponent, {
      panelClass: 'delete-account-popup-panel',
    });
  }

  public openProfileImageDeleteDialog(): void {
    this.dialogRef.open(ProfileImagePopupComponent, {
      panelClass: 'profile-image-popup-panel',
    });
  }

  public resendConfirmationMail() {
    this.loading = true;
    this.authService.resendUserConfirm(this.user?.email!).subscribe({
      next: (_response: any) => {
        this.messageService.resendConfirmationSuccess();
        this.loading = false;
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr
    this.user$ = this.authService.user$.subscribe()

    this.seo.generateTags({
      title: this.translate.instant('meta.profileTitle'),
      description: this.translate.instant('meta.profileDescription'),
      author: 'Zerofiltre.tech',
      type: 'website',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

}
