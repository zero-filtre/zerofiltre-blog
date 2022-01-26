import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

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
    private userService: UserService,
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
    this.userService.login(this.form.value).subscribe({
      next: (response: any) => {
        const token = response.headers.get('authorization').split(' ')[1]
        console.log('Authorisation Header: ', token);
        // this.router.navigate(['/']);
        this.form.reset();
        this.messageservice.openSnackBarSuccess('Connexion reussie!', '');
      },
      // error: (_error: HttpErrorResponse) => this.messageservice.openSnackBarError('Connexion echouée!', '')
    })
  }

  ngOnInit(): void {
    this.InitForm()
  }

}
