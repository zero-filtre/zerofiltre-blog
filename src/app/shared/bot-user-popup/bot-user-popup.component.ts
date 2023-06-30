import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    private notify: MessageService
  ) {}

  initForm(): void {
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{6,20}$/)]],
    })
  }

  get phoneNumber() { return this.form.get('phoneNumber'); }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleLogin(): void {

    if (!this.phoneNumber.valid) return;

    this.loading = true;

    this.bot.isSignup(this.phoneNumber.value)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.notify.openSnackBarError(err.message, '');
          // this.dialogRef.close();
          return throwError(() => err?.message)
        }),)
      .subscribe(({ is_user, is_signup }) => {
        this.loading = false;
        this.dialogRef.close();

        if (is_user) {
          this.router.navigateByUrl('wachatgpt/user');
        } else {
          // Open the signup multi steps component -> signup the user
        }
      })

    // this.router.navigateByUrl('wachatgpt/user');

  }

  ngOnInit(): void {
    this.initForm();
  }
}
