import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-delete-account-popup',
  templateUrl: './delete-account-popup.component.html',
  styleUrls: ['./delete-account-popup.component.css']
})
export class DeleteAccountPopupComponent implements OnInit {

  public loading: boolean = false;
  public user!: User;

  constructor(
    public dialogRef: MatDialogRef<DeleteAccountPopupComponent>,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleDeleteAccount(): void {
    this.loading = true;

    this.authService.deleteUserAccount(this.user?.id!).subscribe({
      next: (response) => {
        this.authService.logout();
        this.router.navigateByUrl(`/`);
        this.messageService.openSnackBarSuccess(response, 'OK');
        this.loading = false;
        this.dialogRef.close();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr
  }

}
