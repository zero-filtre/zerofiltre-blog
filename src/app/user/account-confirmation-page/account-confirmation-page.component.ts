import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
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
  public successMessage!: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  public verifyToken(): void {
    this.loading = true
    this.authService.registrationConfirm(this.token).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isTokenValid = true;
        this.messageService.openSnackBarSuccess(response, 'Ok', 0);
        this.successMessage = "Felicitations, votre compte a été confirmé ! Cliquez sur le lien en dessous pour vous rendre à la page d'acceuil."
      },
      error: (_error: HttpErrorResponse) => {
        if (!this.token) this.messageService.cancel();
        this.loading = false;
        this.isTokenValid = false;
      }
    });
  }

  public resendUserConfirmation(): void {
    this.authService.resendUserConfirm('ericmbouwe@gmail.com').subscribe({
      next: (response: any) => {
        this.messageService.openSnackBarSuccess(response, 'Ok');
      }
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    this.verifyToken();
  }

}
