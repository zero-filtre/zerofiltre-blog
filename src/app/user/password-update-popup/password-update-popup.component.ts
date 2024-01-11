import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-update-popup',
  templateUrl: './password-update-popup.component.html',
  styleUrls: ['./password-update-popup.component.css']
})
export class PasswordUpdatePopupComponent implements OnInit {

  public title!: string;
  public placeholder!: string
  public loading: boolean = false;

  public form!: FormGroup;
  public passwordVisible = false;
  public oldPasswordVisible = false;
  public matchingPasswordVisible = false;

  constructor(
    private loadEnvService: LoadEnvService,
    public dialogRef: MatDialogRef<PasswordUpdatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.title = 'Changer votre mot de passe';
    this.placeholder = 'Nouveau mot de passe'
  }

  public InitForm(): void {
    this.form = this.formbuilder.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}/)]],
      matchingPassword: ['', [Validators.required]],
    })
  }

  get oldPassword() { return this.form.get('oldPassword'); }
  get password() { return this.form.get('password'); }
  get matchingPassword() { return this.form.get('matchingPassword'); }

  onNoClick(): void {
    this.dialogRef.close();
  }

  passwordDoesMatch(): boolean {
    return this.password?.value == this.matchingPassword?.value
  }

  public togglePasswordVisibility(el: string) {
    if (el==='pwd') this.passwordVisible = !this.passwordVisible;
    if (el==='oldPwd') this.oldPasswordVisible = !this.oldPasswordVisible;
    if (el==='matchPwd') this.matchingPasswordVisible = !this.matchingPasswordVisible;
  }

  handlePasswordUpdate(): void {
    this.loading = true;

    this.authService.updateUserPassword(this.form.value).subscribe({
      next: (response) => {
        this.messageService.openSnackBarSuccess(response, 'OK');
        this.loading = false;
        this.dialogRef.close();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.InitForm();
  }

}
