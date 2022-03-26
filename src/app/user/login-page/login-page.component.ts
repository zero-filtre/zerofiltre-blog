import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public loading: boolean = false;
  public readonly GITHUB_CLIENT_ID = environment.GITHUB_CLIENT_ID;
  public readonly STACK_OVERFLOW_CLIENT_ID = environment.STACK_OVERFLOW_CLIENT_ID;
  public readonly gitHubRedirectURL = environment.gitHubRedirectURL;
  public readonly stackOverflowRedirectURL = environment.stackOverflowRedirectURL;
  redirectURL: any;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private messageservice: MessageService,
    private seo: SeoService,
    private route: ActivatedRoute,
  ) { }

  public InitForm(): void {
    this.form = this.formbuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  public login(): void {
    this.loading = true;
    this.authService.login(this.form.value, this.redirectURL).subscribe({
      next: (_response: any) => {
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.messageservice.loginError();
      },
    })
  }

  public setRedirectURL() {
    this.authService.setRedirectUrlValue(this.redirectURL);
  }

  ngOnInit(): void {
    this.InitForm();

    this.redirectURL = this.route.snapshot.queryParamMap.get('redirectURL')!;

    this.seo.generateTags({
      title: 'Se connecter | Zerofiltre.tech',
      description: "Développez des Apps à valeur ajoutée pour votre business et pas que pour l'IT. Avec Zerofiltre, profitez d'offres taillées pour chaque entreprise. Industrialisez vos Apps. Maintenance, extension, supervision.",
      author: 'Zerofiltre.tech',
      type: 'website',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    this.form.reset();
    this.loading = false;
  }

}
