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
import { map, Observable, shareReplay } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { LoadEnvService } from 'src/app/services/load-env.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userID!: string;
  loading!: boolean;
  loadingUser!: boolean;

  loggedUser$!: Observable<User>;
  user$!: Observable<User>;

  constructor(
    private loadEnvService: LoadEnvService,
    private dialogRef: MatDialog,
    private seo: SeoService,
    public authService: AuthService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) { }

  openPasswordEntryDialog(): void {
    this.dialogRef.open(PasswordUpdatePopupComponent, {
      panelClass: 'password-popup-panel',
    });
  }

  openAccountDeleteDialog(): void {
    this.dialogRef.open(DeleteAccountPopupComponent, {
      panelClass: 'delete-account-popup-panel',
    });
  }

  openProfileImageDeleteDialog(): void {
    this.dialogRef.open(ProfileImagePopupComponent, {
      panelClass: 'profile-image-popup-panel',
    });
  }

  resendConfirmationMail(email: string) {
    this.loading = true;
    this.authService.resendUserConfirm(email).subscribe({
      next: (_response: any) => {
        this.messageService.resendConfirmationSuccess();
        this.loading = false;
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    });
  }

  loadUser() {
    this.loadingUser = true;
    this.loggedUser$ = this.authService.refreshUser()
      .pipe(
        map(user => {
          this.loadingUser = false;
          return user;
        }),
        shareReplay()
      )
  }


  ngOnInit(): void {
    this.loadUser();

    this.seo.generateTags({
      title: this.translate.instant('meta.profileTitle'),
      description: this.translate.instant('meta.profileDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }
}
