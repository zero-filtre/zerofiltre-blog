import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
import { LoadEnvService } from 'src/app/services/load-env.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  readonly activeCourseModule = environment.courseRoutesActive === 'true';
  readonly blogUrl = environment.blogUrl;

  prod = this.blogUrl.startsWith('https://dev.') ? false : true;

  userID!: string;
  loading!: boolean;
  loadingUser!: boolean;

  loggedUser$!: Observable<User>;
  user$!: Observable<User>;
  stripeRoute = this.prod ? 'https://billing.stripe.com/p/login/eVa02LasC8V116EbII' : 'https://billing.stripe.com/p/login/test_28odSt4jj89l8kE6oo';

  constructor(
    private loadEnvService: LoadEnvService,
    private dialogRef: MatDialog,
    private seo: SeoService,
    public authService: AuthService,
    private messageService: MessageService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformID: any
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
    if (isPlatformBrowser(this.platformID)) {
      this.loadUser();
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.profileTitle'),
      description: this.translate.instant('meta.profileDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }
}
