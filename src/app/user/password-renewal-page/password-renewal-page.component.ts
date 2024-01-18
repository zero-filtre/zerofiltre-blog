import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-renewal-page',
  templateUrl: './password-renewal-page.component.html',
  styleUrls: ['./password-renewal-page.component.css']
})
export class PasswordRenewalPageComponent implements OnInit, OnDestroy {
  public loading = false;
  public isTokenValid = false;
  public token!: string;
  public successMessage!: boolean;
  public tokenSub!: Subscription;
  public savePasswordSub!: Subscription;

  public form!: FormGroup;
  public passwordVisible = false;
  public matchingPasswordVisible = false;

  constructor(
    private loadEnvService: LoadEnvService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private seo: SeoService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  public initForm(): void {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}/)]],
      matchingPassword: ['', [Validators.required]],
    })
  }

  get password() { return this.form.get('password'); }
  get matchingPassword() { return this.form.get('matchingPassword'); }

  get passwordDoesMatch() {
    return this.password?.value === this.matchingPassword?.value;
  }

  public togglePasswordVisibility(el: string) {
    if (el==='pwd') this.passwordVisible = !this.passwordVisible;
    if (el==='matchPwd') this.matchingPasswordVisible = !this.matchingPasswordVisible;
  }

  public verifyToken(): void {
    this.loading = true
    this.tokenSub = this.authService.verifyTokenForPasswordReset(this.token).subscribe({
      next: (_response: any) => {
        this.loading = false;
        this.isTokenValid = true;

        this.initForm();
      },
      error: (_error: HttpErrorResponse) => {
        if (!this.token) this.messageService.cancel();
        this.loading = false;
        this.isTokenValid = false;
      }
    })
  }

  public savePassword(): void {
    this.loading = true;
    this.savePasswordSub = this.authService.savePasswordReset({ ...this.form.value, token: this.token }).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.authService.logout();
        this.messageService.openSnackBarSuccess(response, 'Ok');
        this.successMessage = true;
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;

    if (isPlatformBrowser(this.platformId)) {
      if (this.token) {
        this.verifyToken();
      }
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.passwordRenewalTite'),
      description: this.translate.instant('meta.passwordRenewalDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    if (this.tokenSub) {
      this.tokenSub.unsubscribe();
    }

    if (this.savePasswordSub) {
      this.savePasswordSub.unsubscribe();
    }
  }
}
