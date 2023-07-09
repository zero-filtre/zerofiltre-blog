import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bot-signup-form',
  templateUrl: './bot-signup-form.component.html',
  styleUrls: ['./bot-signup-form.component.css']
})
export class BotSignupFormComponent {

  form: FormGroup;
  step = 1;
  saving: boolean;
  userNumber: string;

  sendingCode: boolean;
  signupMode: boolean;
  confirmMode: boolean;

  verificationId$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private bot: BotService,
    private notify: MessageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BotSignupFormComponent>,
  ) { }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      prename: [''],
      phone: [''],
      password: [''],
      gender: [''],
      city: [''],
      statut: [''],
      domain: [''],
    });
  }

  get name() { return this.form.get('name'); }
  get prename() { return this.form.get('prename'); }
  get phone() { return this.form.get('phone'); }
  get gender() { return this.form.get('gender'); }
  get city() { return this.form.get('city'); }
  get statut() { return this.form.get('statut'); }
  get domain() { return this.form.get('domain'); }

  nextStep() {
    this.step = 2;
  }

  cancel() {
    this.dialogRef.close();
  }

  back() {
    this.step = 1;;
  }

  sendConfirmationCode() {

    this.sendingCode = true;

    const phoneValue = this.data.phone.e164Number.substring(1);
    const payload = {
      "phone": phoneValue,
    }

    this.verificationId$ = this.bot.sendCode(payload)
      .pipe(
        catchError(err => {
          this.sendingCode = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),
        map(({ _message, verification_id }) => {
          this.sendingCode = false;
          this.confirmMode = true;
          return verification_id;
        })
      )
  }

  signup(): void {
    this.saving = true;

    const payload = {
      ...this.form.value,
      phone: this.data.phone.e164Number.substring(1),
    }

    this.bot.signup(payload)
      .pipe(
        catchError(err => {
          this.saving = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),)
      // .subscribe(({ expireAt, token, user }) => {
      .subscribe(_data => {
        // this.bot.saveTokenToLS(token, expireAt);
        this.saving = false;
        this.dialogRef.close();
        this.notify.openSnackBarSuccess('Félicitations, votre compte a bien été crée!', 'OK');
        // this.router.navigateByUrl('wachatgpt/user');
      })

  }

  ngOnInit(): void {
    this.userNumber = this.data.phone;
    this.initForm();
    this.sendConfirmationCode();
  }
}
