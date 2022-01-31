import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

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
    private messageService: MessageService,
    private state: ActivatedRoute
  ) {
    if (this.authService.isLoggedIn$) {
      this.router.navigateByUrl('/articles');
    }
  }

  public InitForm(): void {
    this.form = this.formuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9]+).[A-Za-z]{2,}')]],
      password: ['', [Validators.required, Validators.pattern(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})$/)]],
      matchingPassword: ['', [Validators.required]],
    })
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get matchingPassword() { return this.form.get('matchingPassword'); }
  get pseudo() { return this.form.get('pseudo'); }
  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }

  get passwordDoesMatch() {
    return this.password?.value === this.matchingPassword?.value;
  }

  public signup(): void {
    this.loading = true;

    this.authService.signup(this.form.value).subscribe({
      next: (response: User) => {
        console.log('USER: ', response);
        this.router.navigate(['/']);
        this.form.reset();
        this.loading = false;
        this.messageService.signUpSuccess();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        // this.messageService.loginError()
      }
    })
  }

  ngOnInit(): void {
    this.InitForm()
  }

}
