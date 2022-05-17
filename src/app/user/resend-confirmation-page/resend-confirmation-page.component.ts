import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-resend-confirmation-page',
  templateUrl: './resend-confirmation-page.component.html',
  styleUrls: ['./resend-confirmation-page.component.css']
})
export class ResendConfirmationPageComponent implements OnInit {

  public form!: FormGroup;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private seo: SeoService,
    private translate: TranslateService
  ) { }

  public InitForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9]+).[A-Za-z]{2,}')]],
    })
  }

  get email() { return this.form.get('email'); }

  public resendUserConfirmation(): void {
    this.loading = true;
    this.authService.resendUserConfirm(this.email?.value).subscribe({
      next: (response: any) => {
        this.messageService.openSnackBarSuccess(response, '');
        this.loading = false;
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.InitForm();

    this.seo.generateTags({
      title: this.translate.instant('meta.resendConfirmationAccountTitle'),
      description: this.translate.instant('meta.resendConfirmationAccountDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

}
