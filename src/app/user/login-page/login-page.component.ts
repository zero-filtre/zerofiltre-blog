import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public form!: FormGroup;
  public loading: boolean = false;
  public GITHUB_CLIENT_ID: string = '';
  public STACK_OVERFLOW_CLIENT_ID: string = '';
  public gitHubRedirectURL: string = '';
  public stackOverflowRedirectURL: string = '';
  public path: string = '/';

  constructor(
    private formuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageservice: MessageService
  ) { }

  private redirectTo(): void {
    if (this.authService.isLoggedIn$) this.router.navigate(['/']);
  }

  public InitForm(): void {
    this.form = this.formuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  public login(): void {
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: (_response: any) => {
        this.router.navigate(['/']);
        this.form.reset();
        this.loading = false;
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.messageservice.loginError()
      }
    })
  }

  ngOnInit(): void {
    this.InitForm()
  }

}
