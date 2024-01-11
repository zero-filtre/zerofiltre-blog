import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';

@Component({
  selector: 'app-add-email-popup',
  templateUrl: './add-email-popup.component.html',
  styleUrls: ['./add-email-popup.component.css']
})
export class AddEmailPopupComponent {

  form: FormGroup;
  saving: boolean;

  constructor(
    private loadEnvService: LoadEnvService,
    private fb: FormBuilder,
    private notify: MessageService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEmailPopupComponent>,
  ) { }

  initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9]+).[A-Za-z]{2,}')]],
    });
  }

  get email() { return this.form.get('email'); }

  saveEmail() {
    this.saving = true;
    const dataToSend = { ...this.authService.currentUsr, email: this.email.value }

    this.authService.updateUserProfile(dataToSend).subscribe({
      next: (updatedUser: User) => {
        this.sendConfirmationEmail(updatedUser.email);
      },
      error: (_error: HttpErrorResponse) => {
        this.notify.openSnackBarError("Echec de l'enregistrement de l'adresse", '')
        this.saving = false;
      }
    });

  };

  sendConfirmationEmail(email: string) {
    this.authService.resendUserConfirm(email).subscribe({
      next: (_response: any) => {
        this.notify.resendConfirmationSuccess();
        this.saving = false;
        this.dialogRef.close();
      },
      error: (_error: HttpErrorResponse) => {
        this.notify.openSnackBarError("Echec d'envoi du message de confirmation", '')
        this.saving = false;
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

}
