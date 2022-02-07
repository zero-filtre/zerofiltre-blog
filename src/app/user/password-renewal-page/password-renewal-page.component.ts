import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  public form!: FormGroup;
  public successMessage!: string;
  public tokenSub!: Subscription;
  public savePasswordSub!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private seo: SeoService
  ) { }

  public initForm(): void {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})$/)]],
      matchingPassword: ['', [Validators.required]],
    })
  }

  get password() { return this.form.get('password'); }
  get matchingPassword() { return this.form.get('passwordConfirm'); }

  get passwordDoesMatch() {
    return this.password?.value === this.matchingPassword?.value;
  }

  public verifyToken(): void {
    this.loading = true
    this.tokenSub = this.authService.verifyTokenForPasswordReset(this.token).subscribe({
      next: (_response: any) => {
        this.loading = false;
        this.isTokenValid = true;
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
        this.successMessage = 'Bravo vous avez crée un mot de passe avec succes! Veuillez retourner à la page de connexion.'
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    this.verifyToken();
    this.initForm();

    this.seo.generateTags({
      title: 'Nouveau mot de passe | Zerofiltre.tech',
      description: "Développez des Apps à valeur ajoutée pour votre business et pas que pour l'IT. Avec Zerofiltre, profitez d'offres taillées pour chaque entreprise. Industrialisez vos Apps. Maintenance, extension, supervision.",
      author: 'Zerofiltre.tech',
      type: 'website',
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
