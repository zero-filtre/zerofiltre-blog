import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  public form!: FormGroup;
  public loading: boolean = false;
  public readonly GITHUB_CLIENT_ID = environment.GITHUB_CLIENT_ID;
  public readonly STACK_OVERFLOW_CLIENT_ID = environment.STACK_OVERFLOW_CLIENT_ID;
  public readonly gitHubRedirectURL = environment.gitHubRedirectURL;
  public readonly stackOverflowRedirectURL = environment.stackOverflowRedirectURL;
  public path: string = '/';

  constructor(
    private formuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageservice: MessageService
  ) { }

  public InitForm(): void {
    this.form = this.formuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      pseudo: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  get pseudo() { return this.form.get('pseudo'); }
  get name() { return this.form.get('nom'); }

  public signup(): void {
    this.loading = true;
    setTimeout(() => this.loading = false, 2000)
    console.log('Sign up started');
    // this.authService.signup(this.form.value).subscribe({
    //   next: (_response: any) => {
    //     this.router.navigate(['/']);
    //     this.form.reset();
    //     this.loading = false;
    //   },
    //   error: (_error: HttpErrorResponse) => {
    //     this.loading = false;
    //     this.messageservice.loginError()
    //   }
    // })
  }

  ngOnInit(): void {
    this.InitForm()
  }

}
