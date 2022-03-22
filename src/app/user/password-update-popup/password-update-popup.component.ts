import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-update-popup',
  templateUrl: './password-update-popup.component.html',
  styleUrls: ['./password-update-popup.component.css']
})
export class PasswordUpdatePopupComponent implements OnInit {

  public title!: string;
  public placeholder!: string
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PasswordUpdatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
  ) {
    this.title = 'Changer votre mot de passe';
    this.placeholder = 'Nouveau mot de passe'
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handlePasswordUpdate(): void {
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
