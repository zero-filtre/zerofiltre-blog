import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { catchError, throwError } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { BotSignupFormComponent } from '../bot-signup-form/bot-signup-form.component';

@Component({
  selector: 'app-bot-user-popup',
  templateUrl: './bot-user-popup.component.html',
  styleUrls: ['./bot-user-popup.component.css']
})
export class BotUserPopupComponent {
  loading: boolean = false;
  form!: FormGroup;
  authForm!: FormGroup;
  phoneNotValid: boolean;
  authMode:boolean;

  constructor(
    private loadEnvService: LoadEnvService,
    public dialogRef: MatDialogRef<BotUserPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private bot: BotService,
    private notify: MessageService,
    private signUpDialogRef: MatDialog,
  ) {}

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.France,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];
  placeholderNumberFormat: PhoneNumberFormat = PhoneNumberFormat.National
  currentCountry: CountryISO = CountryISO[this.currentCountryName];

  get currentCountryName() {
    let name = localStorage.getItem('_location');
    name = name.split(' ').map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('')
    return name
  }

  initForm(): void {
    this.form = this.fb.group({
      phoneNumber: [''],
      password: ['', [Validators.required]]
    })
  }

  get password() { return this.form.get('password'); }
  get phoneNumber() { return this.form.get('phoneNumber'); }

  onNoClick(): void {
    this.dialogRef.close();
  }


  openSignUpDialog() {
    this.signUpDialogRef.open(BotSignupFormComponent, {
      panelClass: 'popup-panel',
      data: {
        phone: this.phoneNumber.value
      }
    });
  }


  checkisSignup(): void {
    
    if (!this.phoneNumber.valid) {
      this.phoneNotValid = true;
      return;
    }

    this.openSignUpDialog();
    return

    this.phoneNotValid = false;
    this.loading = true;
    const phoneValue = this.phoneNumber.value.e164Number.substring(1);

    this.bot.isSignup(phoneValue)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),)
      .subscribe(({ is_user, is_signup }) => {
        this.loading = false;

        if (!is_user) {
          window.location.href = 'https://wa.me/237693176973?text=Hello';
          this.dialogRef.close();
          return
        }

        if (is_signup) {
          this.authMode = true;
        } else {
          this.dialogRef.close();
          this.openSignUpDialog();
        }
      })
  }

  login(): void {
    this.loading = true;

    const phoneValue = this.phoneNumber.value.e164Number.substring(1);
    const payload = {
      "phone": phoneValue,
      "password": this.password.value
    }

    this.bot.signin(payload)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),)
      .subscribe(({ expireAt, token, user}) => {
        this.bot.saveTokenToLS(token, expireAt);
        this.loading = false;
        this.dialogRef.close();
        this.router.navigateByUrl('wachatgpt/user');
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
