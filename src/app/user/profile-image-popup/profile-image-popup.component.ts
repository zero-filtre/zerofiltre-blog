import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile-image-popup',
  templateUrl: './profile-image-popup.component.html',
  styleUrls: ['./profile-image-popup.component.css']
})
export class ProfileImagePopupComponent implements OnInit {

  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProfileImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadProfileImage(): void {
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

    /**upload image to ovh and start loading
     * => if ok get the returned url and patch the user 
     * => if ok fetch the updatd user
     * => if ok stop loading and assign the updated user to the previous user
     * => if ok, After popup close update the main page profile image with the updated user
     */
  }

  deleteProfileImage(): void {
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