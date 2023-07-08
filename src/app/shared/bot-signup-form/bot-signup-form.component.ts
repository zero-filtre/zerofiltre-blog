import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bot-signup-form',
  templateUrl: './bot-signup-form.component.html',
  styleUrls: ['./bot-signup-form.component.css']
})
export class BotSignupFormComponent {
  // personalInfoForm: FormGroup;
  // accountInfoForm: FormGroup;

  form: FormGroup;
  step = 1;
  saving: boolean;

  constructor(
    private fb: FormBuilder
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

  signup() {
    // Handle form submission
    // ...
  }

  ngOnInit(): void {
    this.initForm();
  }
}
