
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from 'src/app/shared/login-modal/login-modal.component';
import { AuthService } from 'src/app/user/auth.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css']
})
export class SignupModalComponent {
  public form!: FormGroup;
  public loading: boolean = false;
  public readonly GITHUB_CLIENT_ID = environment.GITHUB_CLIENT_ID;
  public readonly STACK_OVERFLOW_CLIENT_ID = environment.STACK_OVERFLOW_CLIENT_ID;
  public readonly gitHubRedirectURL = environment.gitHubRedirectURL;
  public readonly stackOverflowRedirectURL = environment.stackOverflowRedirectURL;
  public path: string = '/';

  public passwordVisible = false;

  constructor(
    private loadEnvService: LoadEnvService,
    private formuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private seo: SeoService,
    private translate: TranslateService,
    private modalService: ModalService,
    private modalRef: MatDialogRef<SignupModalComponent>,
   
  ) { }

  public InitForm(): void {
    this.form = this.formuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9]+).[A-Za-z]{2,}')]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}/)]],
      matchingPassword: ['', [Validators.required]],
    })
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get matchingPassword() { return this.form.get('matchingPassword'); }
  get fullName() { return this.form.get('fullName'); }

  get passwordDoesMatch() {
    return this.password?.value === this.matchingPassword?.value;
  }

  public togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  public signup(): void {
    this.loading = true;

    this.authService.signup(this.form.value).subscribe({
      next: (_response: any) => {
        this.messageService.signUpSuccess();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.InitForm();

    this.seo.generateTags({
      title: this.translate.instant('meta.signupTitle'),
      description: this.translate.instant('meta.signupDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });

   
  }
  public showLoginForm(){
    this.modalRef.close()
    this.modalService.openLoginModal()
  }


  ngOnDestroy(): void {
    this.form.reset();
    this.loading = false;
  }

}


