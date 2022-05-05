import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-account-confirmation-page',
  templateUrl: './account-confirmation-page.component.html',
  styleUrls: ['./account-confirmation-page.component.css']
})
export class AccountConfirmationPageComponent implements OnInit {
  public loading = false;
  public isTokenValid = false;
  public token!: string;
  public successMessage!: boolean;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private seo: SeoService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  public verifyToken(): void {
    this.loading = true
    this.authService.registrationConfirm(this.token).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isTokenValid = true;
        this.messageService.openSnackBarSuccess(response, 'OK');
        this.successMessage = true;
      },
      error: (_error: HttpErrorResponse) => {
        if (!this.token) this.messageService.cancel();
        this.loading = false;
        this.isTokenValid = false;
      }
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.token = this.route.snapshot.queryParamMap.get('token')!;

    if (isPlatformBrowser(this.platformId)) {
      this.verifyToken();
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.accountConfirmationTitle'),
      description: this.translate.instant('meta.accountConfirmationDescription'),
      author: 'Zerofiltre.tech',
      type: 'website',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

}
