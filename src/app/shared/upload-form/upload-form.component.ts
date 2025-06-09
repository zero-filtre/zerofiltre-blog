import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VimeoService } from '../../services/vimeo.service';
import { catchError, throwError, Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {
  url: string;
  videoFile: any;
  fileName: string;
  fileSize: number;
  uri: string;
  videoField: any;
  videoFieldSub: any;

  loading = false;
  uploadProgress: number;

  uploadSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<UploadFormComponent>,
    private vimeo: VimeoService,
    private notify: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.cancelUpload();
    this.dialogRef.close();
  }

  uploadVideoFile(offset: number) {
    this.loading = true;

    const upload$ = this.vimeo.uploadVideoFileTus(this.url, this.videoFile, offset)
      .pipe(
        catchError(err => {
          this.loading = false;
          this.notify.showError(
            'Un probleme est survenu lors du chargement!',
            'OK'
          );
          return throwError(() => err.message)
        }),
        finalize(() => this.reset())
      )

    this.uploadSub = upload$.subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      }

      if (event?.statusText === 'OK') {
        const uploadOffset = +this.extractHeaderFromResponse(event, 'upload-offset');

        if (uploadOffset === this.fileSize) {
          this.loading = false;
          this.dialogRef.close();
          this.updateVideoAfterUpload(this.uri);
          this.notify.showSuccess('Votre vidéo a bien été chargée', 'OK');
          console.log('UPLOAD COMPLETED: ', uploadOffset);
        } else if (uploadOffset < this.fileSize) {
          console.log('STILL UPLOADING: ', uploadOffset);
          this.loading = true;
          this.uploadVideoFile(uploadOffset)
        }
      }
    })
  }

  updateVideoAfterUpload(uri: string) {
    this.videoField.setValue(uri)
    this.videoFieldSub.next(uri);
  }

  cancelUpload() {
    this.uploadSub?.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  extractHeaderFromResponse(response: any, header: string) {
    return response.headers.get(header);
  }

  ngOnInit(): void {
    this.url = this.data.uploadLink;
    this.videoFile = this.data.videoFile;
    this.fileName = this.data.fileName;
    this.fileSize = this.data.fileSize;
    this.uri = this.data.uri;
    this.videoField = this.data.videoField;
    this.videoFieldSub = this.data.videoFieldSub;
  }

}
