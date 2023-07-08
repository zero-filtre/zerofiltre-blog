import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BotService } from 'src/app/services/bot.service';

@Component({
  selector: 'app-bot-phone-verification',
  templateUrl: './bot-phone-verification.component.html',
  styleUrls: ['./bot-phone-verification.component.css']
})
export class BotPhoneVerificationComponent {

  verificationForm: FormGroup;
  showResend: boolean;
  countdown: number;
  loading:boolean;

  constructor(
    private fb: FormBuilder,
    private bot: BotService
  ) { }

  initForm() {
    this.verificationForm = this.fb.group({
      code: ['', Validators.required]
    });
  }

  verify() {
    // Handle verification logic
    // ...

    // Reset the form
    this.verificationForm.reset();
  }

  resend() { }

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
    this.startCountdown();
  }

}
