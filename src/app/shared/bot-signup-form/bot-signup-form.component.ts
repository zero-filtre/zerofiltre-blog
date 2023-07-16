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

  passwordVisible = false;

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
      password: ['', [Validators.required, Validators.pattern(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,55})$/)]],
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
  get password() { return this.form.get('password'); }

  updateSignupModeValue(newValue: boolean) {
    this.signupMode = newValue;
  }
  updateConfirmModeValue(newValue: boolean) {
    this.confirmMode = newValue;
  }

  nextStep() {
    this.step = 2;
  }

  cancel() {
    this.dialogRef.close();
  }

  back() {
    this.step = 1;;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
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
          this.notify.openSnackBarError("Une erreur est survenue lors de l'envoi du code", 'OK');
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
          this.notify.openSnackBarError('Une erreur est survenue.', 'OK');
          return throwError(() => err?.message)
        }),)
      .subscribe(_data => {
        this.saving = false;
        this.dialogRef.close();
        this.notify.openSnackBarSuccess('Félicitations, votre compte a bien été crée!', 'OK');
      })

  }

  ngOnInit(): void {
    this.userNumber = this.data.phone;
    this.initForm();
    this.sendConfirmationCode();
  }
}
