import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bot-login-popup',
  templateUrl: './bot-login-popup.component.html',
  styleUrls: ['./bot-login-popup.component.css']
})
export class BotLoginPopupComponent {

  loading: boolean = false;
  form!: FormGroup;


  constructor(
    private loadEnvService: LoadEnvService,
    public dialogRef: MatDialogRef<BotLoginPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private bot: BotService,
    private notify: MessageService,
  ) { }


  initForm(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
    })
  }

  get password() { return this.form.get('password'); }

  onNoClick(): void {
    this.dialogRef.close();
  }


  login(): void {

    this.bot.signin(this.password)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),)
      .subscribe(({ is_user, is_signup }) => {
        this.loading = false;
        this.dialogRef.close();
      })

  }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.form.reset();
    this.loading = false;
  }
}
