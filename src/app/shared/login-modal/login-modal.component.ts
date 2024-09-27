import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../user/auth.service'
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public loading: boolean = false;
  public readonly GITHUB_CLIENT_ID = environment.GITHUB_CLIENT_ID;
  public readonly STACK_OVERFLOW_CLIENT_ID = environment.STACK_OVERFLOW_CLIENT_ID;
  public readonly gitHubRedirectURL = environment.gitHubRedirectURL;
  public readonly stackOverflowRedirectURL = environment.stackOverflowRedirectURL;
  public redirectURL: string;
  public articleDialog: string;

  public passwordVisible = false;

  constructor(
    private loadEnvService: LoadEnvService,
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private seo: SeoService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private modalRef: MatDialogRef<LoginModalComponent>,
    private modalService: ModalService
  ) { }

  public InitForm(): void {
    this.form = this.formbuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }


  public togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  public login(): void {
    this.loading = true;
    this.authService.login(this.form.value, this.redirectURL).subscribe({
      next: (_response: any) => {
        this.modalRef.close()
      },
      error: (_error: any) => {
        this.loading = false
       
        // this.router.navigate(
        //   ['/login'],
        //   {
        //     relativeTo: this.route,
        //     queryParams: { redirectURL: this.redirectURL },
        //     queryParamsHandling: 'merge',
        //   });
      },
      complete: () => {
        this.loading = false;

      }
    })
  }

  public setRedirectURL() {
    this.authService.setRedirectUrlValue(this.redirectURL);
  }

  public showSignUpForm(){
    this.modalRef.close()
    this.modalService.openSignUpModal()
  }


  ngOnInit(): void {
    this.InitForm();

    this.redirectURL = this.route.snapshot.queryParamMap.get('redirectURL')!;
    this.articleDialog = this.route.snapshot.queryParamMap.get('articleDialog')!;

    this.seo.generateTags({
      title: this.translate.instant('meta.loginTitle'),
      description: this.translate.instant('meta.loginDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    this.form.reset();
    this.loading = false;
  }

}
