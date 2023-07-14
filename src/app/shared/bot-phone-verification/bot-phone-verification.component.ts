import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bot-phone-verification',
  templateUrl: './bot-phone-verification.component.html',
  styleUrls: ['./bot-phone-verification.component.css']
})
export class BotPhoneVerificationComponent {

  verificationForm: FormGroup;
  showResend: boolean;
  countdown: number;
  verifying:boolean;
  sendingCode: boolean;
  userNumber:string;

  @Input() phone: any;
  @Output() confirmMode = new EventEmitter<any>();
  @Output() signupMode = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private bot: BotService,
    private notify: MessageService
  ) { }

  initForm() {
    this.verificationForm = this.fb.group({
      // code: ['', Validators.required, Validators.pattern(/^\d{6}$/)]
      code: ['', Validators.required]
    });
  }

  get code() { return this.verificationForm.get('code'); }

  showSignupForm() {
    this.confirmMode.emit(false);
    this.signupMode.emit(true);
  }

  verify() {

    this.verifying = true;

    const payload = {
      "code": this.code.value,
      "verification_id": localStorage.getItem('_verification_id'),
    }

    this.bot.verifyCode(payload)
      .pipe(
        catchError(err => {
          this.verifying = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }))
      .subscribe(({ _message }) => {
        this.verifying = false;
        localStorage.removeItem('_verification_id');
        this.showSignupForm();
      })
  }

  resendCode() {

    this.sendingCode = true;

    const phoneValue = this.phone.e164Number.substring(1);
    const payload = {
      "phone": phoneValue,
    }

    this.bot.sendCode(payload)
      .pipe(
        catchError(err => {
          this.sendingCode = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }))
        .subscribe(({ _message, _verification_id }) => {
          this.sendingCode = false;
          this.countdown = 150;
          this.showResend = true;
          this.startCountdown();
          this.notify.openSnackBarWarning('Un message whatsapp avec le code vous a été envoyé!', 'OK');
        })
  }

  startCountdown() {
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.showResend = false;
      }
    }, 1000);
  }

  get minutes() {
    return Math.floor(this.countdown / 60);
  }

  get seconds() {
    return this.countdown % 60;
  }

  ngOnInit() {
    this.initForm();

    this.showResend = true;
    this.countdown = 30;
    this.userNumber = this.phone.internationalNumber;
    this.startCountdown();
  }

}
