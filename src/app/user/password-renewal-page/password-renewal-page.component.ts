import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  public initForm(): void {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})$/)]],
      passwordConfirm: ['', [Validators.required]],
    })
  }

  get password() { return this.form.get('password'); }
  get passwordConfirm() { return this.form.get('passwordConfirm'); }

  get passwordDoesMatch() {
    return this.password?.value === this.passwordConfirm?.value;
  }

  public verifyToken(): void {
    this.loading = true
    this.authService.verifyTokenForPasswordReset(this.token).subscribe({
      next: (response: any) => {
        console.log(response);
        this.loading = false;
        this.isTokenValid = true;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.loading = false;
        this.isTokenValid = false;
      }
    })
  }

  public savePassword(): void {

  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    this.verifyToken();
    console.log(this.token);
  }

}
