import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
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

  constructor(
    private fb: FormBuilder,
    private bot: BotService,
    private notify: MessageService,
    private router: Router
    ) {}

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

  cancel() { }

  back() {
    this.step = 1;;
  }


  signup(): void {
    this.saving = true;

    // const phoneValue = this.phone.value.e164Number.substring(1);
    const payload = {
      ...this.form.value,
      phone: '237696278898',
    }

    this.bot.signup(payload)
      .pipe(
        catchError(err => {
          this.saving = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        }),)
      // .subscribe(({ expireAt, token, user }) => {
      .subscribe(data => {
        // this.bot.saveTokenToLS(token, expireAt);
        this.saving = false;
        // this.dialogRef.close();
        this.router.navigateByUrl('wachatgpt/user');
      })

  }

  ngOnInit(): void {
    this.initForm();
  }
}
