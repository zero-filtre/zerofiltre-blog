import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bot-user-popup',
  templateUrl: './bot-user-popup.component.html',
  styleUrls: ['./bot-user-popup.component.css']
})
export class BotUserPopupComponent {
  public loading: boolean = false;
  public form!: FormGroup;

  constructor(
    private loadEnvService: LoadEnvService,
    public dialogRef: MatDialogRef<BotUserPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private bot: BotService,
    private notify: MessageService,
    private signInDialogRef: MatDialog,
    private signUpDialogRef: MatDialog,
  ) {}

  initForm(): void {
    this.form = this.fb.group({
      //TODO: Add a validation display in the template 
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{6,20}$/)]],
    })
  }

  get phoneNumber() { return this.form.get('phoneNumber'); }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSignInDialog() {
    this.signInDialogRef.open(BotUserPopupComponent, {
      panelClass: 'popup-panel',
      data: {
        // router: this.router
      }
    });
  }

  openSignUpDialog() {
    this.signUpDialogRef.open(BotUserPopupComponent, {
      panelClass: 'popup-panel',
      data: {
        // router: this.router
      }
    });
  }


  handleLogin(): void {

    if (!this.phoneNumber.valid) return;

    this.loading = true;

    this.bot.isSignup(this.phoneNumber.value)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),)
      .subscribe(({ is_user, is_signup }) => {
        this.loading = false;
        this.dialogRef.close();

        if (is_signup) {
          //TODO: Implement the signin popup component -> signin the user with the provided pwd
          //TODO: Implement the stats component -> fetch and display the user's stats
          //TODO: Implement the userInfos component -> fetch and display the user's infos / allow single inputs update (updateUser)
          this.openSignInDialog();
        } else {
          //TODO: Implement the signup multi steps popup component -> signup the user
          this.openSignUpDialog();
        }
      })
    
    // Only for demo purposes
    this.router.navigateByUrl('wachatgpt/user');
    this.dialogRef.close();

  }

  ngOnInit(): void {
    this.initForm();
  }
}
