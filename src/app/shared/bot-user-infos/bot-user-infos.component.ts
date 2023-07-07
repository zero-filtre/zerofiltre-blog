import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bot-user-infos',
  templateUrl: './bot-user-infos.component.html',
  styleUrls: ['./bot-user-infos.component.css']
})
export class BotUserInfosComponent {
  @Input() data!: any;

  userInfoForm: FormGroup;
  editMode = false;

  constructor(
    private fb: FormBuilder
    ) {
    this.userInfoForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  edit() {
    this.editMode = true;

    this.userInfoForm.patchValue({
      name: this.data.name,
      email: this.data.name,
      phone: this.data.name
    });
  }

  save() {
    // Handle form submission and saving of data
    // ...
    this.editMode = false;
  }

  cancel() {
    this.editMode = false;
  }
}
