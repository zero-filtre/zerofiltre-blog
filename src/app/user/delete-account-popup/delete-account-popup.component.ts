import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleDeleteAccount(): void {
    this.loading = true;

    this.authService.deleteUserAccount(this.user?.id!).subscribe({
      next: (response) => {
        this.loading = false;
        this.dialogRef.close();
        this.authService.logout();
        this.data.router.navigateByUrl(`/`);
        this.messageService.openSnackBarSuccess(response, '', 0);
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
        this.dialogRef.close();
      }
    })
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr
  }

}
