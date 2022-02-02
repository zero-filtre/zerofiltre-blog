import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-renewal-page',
  templateUrl: './password-renewal-page.component.html',
  styleUrls: ['./password-renewal-page.component.css']
})
export class PasswordRenewalPageComponent implements OnInit {
  public loading = false;
  public isTokenValid = false;
  public token!: string;
  public form!: FormGroup;
  public successMessage!: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageservice: MessageService
  ) { }

  public initForm(): void {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})$/)]],
      matchingPassword: ['', [Validators.required]],
    })
  }

  get password() { return this.form.get('password'); }
  get matchingPassword() { return this.form.get('passwordConfirm'); }

  get passwordDoesMatch() {
    return this.password?.value === this.matchingPassword?.value;
  }

  public verifyToken(): void {
    this.loading = true
    this.authService.verifyTokenForPasswordReset(this.token).subscribe({
      next: (_response: any) => {
        this.loading = false;
        this.isTokenValid = true;
        // this.successMessage = 'Bravo vous avez crée un mot de passe avec succes ! Veuillez retournez à la page de connexion.'
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.isTokenValid = false;
      }
    })
  }

  public savePassword(): void {
    this.loading = true;
    this.authService.savePasswordReset({ ...this.form.value, token: this.token }).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.authService.logout();
        this.messageservice.openSnackBarSuccess(response, 'Ok', 0);
        this.successMessage = 'Bravo vous avez crée un mot de passe avec succes ! Veuillez retournez à la page de connexion.'
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    this.verifyToken();
    this.initForm();
  }

}
