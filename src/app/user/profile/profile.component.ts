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
import { map, Observable, Subscription, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user!: User;
  public loggedUser!: User;
  public userID!: string;
  public loading!: boolean;

  public loggedUser$!: Subscription;
  public user$!: Observable<User>;

  constructor(
    private dialogRef: MatDialog,
    private seo: SeoService,
    public authService: AuthService,
    private messageService: MessageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
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


  public isConnectedUserProfile(user: any): boolean {
    return this.loggedUser?.fullName == user?.fullName
  }

  ngOnInit(): void {
    this.loggedUser = this.authService?.currentUsr

    // this.route.paramMap.subscribe(
    //   params => {
    //     this.userID = params.get('userID')!;
    //     this.getUserProfile(this.userID);
    //   }
    // );

    this.user$ = this.route.data.pipe(
      tap(({ user }: any) => {
        if (this.isConnectedUserProfile(user)) {
          console.log('FETCH LOGGED-IN USER!')
          this.authService.user$.subscribe(
            data => this.loggedUser = data
          );
        }
      }),
      map(data => data.user)
    )

    this.seo.generateTags({
      title: this.translate.instant('meta.profileTitle'),
      description: this.translate.instant('meta.profileDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }
}
