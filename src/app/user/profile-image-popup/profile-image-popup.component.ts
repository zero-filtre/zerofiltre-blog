import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, map, of, throwError } from 'rxjs';
import { File } from 'src/app/articles/article.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-profile-image-popup',
  templateUrl: './profile-image-popup.component.html',
  styleUrls: ['./profile-image-popup.component.css']
})
export class ProfileImagePopupComponent implements OnInit {
  public user!: User;
  public loading: boolean = false;
  public uploading = false;

  public file: File = {
    data: null,
    inProgress: false,
    progress: 0
  };

  public profileData!: User;


  constructor(
    public fileUploadService: FileUploadService,
    public dialogRef: MatDialogRef<ProfileImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
  ) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onFileSelected(event: any) {
    this.file = {
      data: <File>event.target.files[0],
      inProgress: false,
      progress: 0
    };

    this.uploadProfileImage();
  }


  public uploadProfileImage(): void {
    const fileName = this.file.data.name

    this.file.inProgress = true;
    this.uploading = true;

    if (this.user?.profilePicture) {
      this.deleteProfileImage()
    }

    this.fileUploadService.uploadImage(fileName, this.file.data).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((_error: HttpErrorResponse) => {
        this.file.inProgress = false;
        this.uploading = false;
        this.dialogRef.close();
        return of('Upload failed');

      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          const formData = { ...this.profileData, profilePicture: event.url }
          this.authService.updateUserProfile(formData)
            .subscribe(this.handleUserUpdate)
        }
      })
  }

  public deleteProfileImage(): void {
    this.uploading = true;

    const fileName = this.user?.profilePicture?.split('/')[6]!;
    const fileNameUrl = this.user?.profilePicture?.split('/')[2];

    if (fileNameUrl !== 'storage.gra.cloud.ovh.net') {
      this.uploading = false;

      const formData = { ...this.profileData, profilePicture: '' }
      this.authService.updateUserProfile(formData)
        .subscribe(this.handleUserUpdate)
      return;
    }

    this.fileUploadService.removeImage(fileName)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            const formData = { ...this.profileData, profilePicture: '' }
            this.authService.updateUserProfile(formData)
              .subscribe(this.handleUserUpdate)
          }
          this.uploading = false;
          return throwError(() => error)
        })
      )
      .subscribe({
        next: () => {
          const formData = { ...this.profileData, profilePicture: '' }
          this.authService.updateUserProfile(formData)
            .subscribe(this.handleUserUpdate)
        },
      })
  }

  private handleUserUpdate = {
    next: (response: User) => {
      this.user.profilePicture = response.profilePicture;
      this.authService.setUserData(response)
      this.uploading = false;
    },
    error: (_err: HttpErrorResponse) => {
      this.dialogRef.close();
      this.uploading = false;
    }
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr

    this.profileData = {
      id: this.user?.id,
      fullName: this.user?.fullName,
      profession: this.user?.profession,
      bio: this.user?.bio,
      language: "fr",
      socialLinks: this.user?.socialLinks,
      website: this.user?.website
    }

  }
}
