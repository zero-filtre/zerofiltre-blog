import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public loading: boolean = false;
  public readonly GITHUB_CLIENT_ID = environment.GITHUB_CLIENT_ID;
  public readonly STACK_OVERFLOW_CLIENT_ID = environment.STACK_OVERFLOW_CLIENT_ID;
  public readonly gitHubRedirectURL = environment.gitHubRedirectURL;
  public readonly stackOverflowRedirectURL = environment.stackOverflowRedirectURL;
  public path: string = '/';

  constructor(
    private formuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private seo: SeoService
  ) { }

  public InitForm(): void {
    this.form = this.formuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9]+).[A-Za-z]{2,}')]],
      password: ['', [Validators.required, Validators.pattern(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})$/)]],
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
      title: "S'enregistrer | Zerofiltre.tech",
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
