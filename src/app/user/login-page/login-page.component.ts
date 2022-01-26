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

  constructor(
    private formuilder: FormBuilder,
    private router: Router,
    private AuthService: AuthService,
    private messageservice: MessageService
  ) { }

  public InitForm(): void {
    this.form = this.formuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  // Kem89dd$

  public login(): void {
    console.log('Login called');
    this.AuthService.login(this.form.value).subscribe({
      next: (_response: any) => {
        // const token = response.headers.get('authorization').split(' ')[1]
        // console.log('Authorisation Header: ', token);
        this.router.navigate(['/']);
        this.form.reset();
        this.messageservice.openSnackBarSuccess('Connexion reussie!', '');
      },
      // error: (error: HttpErrorResponse) => {
      //   console.log('ERR: ', error);
      //   this.messageservice.loginError()
      // }
    })
  }

  ngOnInit(): void {
    this.InitForm()
  }

}
