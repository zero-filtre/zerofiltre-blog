import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-delete-account-popup',
  templateUrl: './delete-account-popup.component.html',
  styleUrls: ['./delete-account-popup.component.css']
})
export class DeleteAccountPopupComponent implements OnInit {

  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteAccountPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleDeleteAccount(): void {
    this.loading = true;

    // this.authService.createArticle(this.title).subscribe({
    //   next: (response) => {
    //     this.article = response;
    //     this.data.router.navigateByUrl(`articles/${this.article.id}/edit`);
    //     this.loading = false;
    //     this.dialogRef.close();
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.loading = false;
    //     this.dialogRef.close();
    //   }
    // })
  }

  ngOnInit(): void {
  }

}
