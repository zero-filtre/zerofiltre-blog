import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { resolve } from 'dns';
import { catchError, throwError } from 'rxjs';
import { BotService } from 'src/app/services/bot.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bot-user-infos',
  templateUrl: './bot-user-infos.component.html',
  styleUrls: ['./bot-user-infos.component.css']
})
export class BotUserInfosComponent {
  @Input() data!: any;

  form: FormGroup;
  editMode = false;
  saving: boolean;

  constructor(
    private fb: FormBuilder,
    private bot: BotService,
    private notify: MessageService
    ) {
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

  edit() {
    this.editMode = true;

    this.form.patchValue({
      name: this.data.name,
      prename: this.data.prename,
      phone: this.data.phone,
      gender: this.data.gender,
      city: this.data.city,
      statut: this.data.statut,
      domain: this.data.domain
    });
  }

  save() {
    this.saving = true;
    this.bot.updateUser(this.form.value)
      .pipe(
        catchError(err => {
          this.saving = false;
          this.notify.openSnackBarError(err.message, '');
          return throwError(() => err?.message)
        })
      )
      .subscribe(_response => {
        this.saving = false;
        this.data = this.form.value;
        this.editMode = false;
      })

  }

  cancel() {
    this.editMode = false;
  }
}
