import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { MatDialog } from '@angular/material/dialog';
import { ArticleEntryPopupComponent } from 'src/app/articles/article-entry-popup/article-entry-popup.component';

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
    private loadEnvService: LoadEnvService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private seo: SeoService,
    private translate: TranslateService,
    public router: Router,
    public dialogEntryRef: MatDialog,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  public verifyToken(): void {
    this.loading = true
    this.authService.registrationConfirm(this.token).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isTokenValid = true;
        this.messageService.showSuccess(response, 'OK');
        this.successMessage = true;
      },
      error: (_error: HttpErrorResponse) => {
        if (!this.token) this.messageService.cancel();
        this.loading = false;
        this.isTokenValid = false;
      }
    });
  }

  openArticleEntryDialog(): void {
    const currUser = this.authService.currentUsr as User;
    const loggedIn = !!currUser;

    if (!loggedIn) {
      this.router.navigate(
        ['/login'],
        {
          relativeTo: this.route,
          queryParams: { redirectURL: this.router.url, articleDialog: true },
          queryParamsHandling: 'merge',
        });

      this.messageService.showInfo(
        'Veuillez vous connecter pour rédiger un article 🙂',
        'OK'
      );

      return;
    }

    this.dialogEntryRef.open(ArticleEntryPopupComponent, {
      width: '850px',
      height: '350px',
      panelClass: 'article-popup-panel',
      data: {
        router: this.router
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
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

}
