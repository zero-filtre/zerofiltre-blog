import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, shareReplay, Subject, tap, throwError, map, EMPTY } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from './message.service';
import { FormControl } from '@angular/forms';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Container-Meta-Access-Control-Allow-Origin': '*'
  }),
};


@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  readonly apiServerUrl = environment.apiBaseUrl;
  readonly ovhServerUrl = environment.ovhServerUrl;

  private readonly XTOKEN_NAME = 'x_token';

  private readonly subject = new BehaviorSubject<any>(null!);
  public xToken$ = this.subject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private  readonly messageService: MessageService,
    @Inject(PLATFORM_ID) private readonly platformId: any
  ) {
    this.getOvhToken();
  }

  getOvhToken() {
    this.xToken$ = this.http.get<any>(`${this.apiServerUrl}/ovh/token`).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      tap(({ accessToken, expiresAt }: any) => {
        const xToken = accessToken;
        const expireAt = expiresAt;
        const tokenObj = {
          xToken,
          expireAt,
        };

        this.subject.next(tokenObj);
        localStorage.setItem(this.XTOKEN_NAME, JSON.stringify(tokenObj));
      }),
      shareReplay()
    );
  }

  private extractTokenFromHeaders(response: any) {
    return response.headers.get('X-Subject-Token');
  }

  get xTokenData(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.XTOKEN_NAME);
    }
    return null;
  }

  get xTokenObj(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(this.xTokenData);
    }
    return null;
  }

  private validateImage(file: File): boolean {
    const maxSize = 5;

    const sizeUnit = 1024 * 1024;
    const fileSize = Math.round(file.size / sizeUnit);
    const fileType = file.type.split('/')[1];

    if (
      fileType !== 'jpeg' &&
      fileType !== 'png' &&
      fileType !== 'jpg' &&
      fileType !== 'svg' &&
      fileType !== 'pdf'
    ) {
      this.messageService.fileTypeWarning();
      return false;
    } else if (fileSize > maxSize) {
      this.messageService.fileSizeWarning(maxSize);
      return false;
    } else {
      return true;
    }

  }

  private validateResource(file: File): boolean {
    const maxSize = 200;
    const acceptedTypes = ['txt', 'pdf', 'img', 'zip', 'doc', 'docx'];

    const sizeUnit = 1024 * 1024;
    const fileSize = Math.round(file.size / sizeUnit);
    let fileType = file.type;

    if (fileType.startsWith('image')) {
      fileType = 'img';
    } else {
      const nameParts = file.name.split('.');
      fileType = nameParts[nameParts.length - 1];
    }

    if (!acceptedTypes.includes(fileType)) {
      this.messageService.openSnackBarWarning(
        "Le document n'est pas au format autorisé ('.txt', '.pdf', '.zip', '.doc', 'image*')",
        'OK'
      );
      return false;
    } else if (fileSize > maxSize) {
      this.messageService.fileSizeWarning(maxSize);
      return false;
    } else {
      return true;
    }
  }

  private uploadImage(fileName: string, file: File): Observable<any> {
    if (!this.validateImage(file))
      return throwError(() => new Error('Invalid file'));

    const xToken = this.xTokenObj?.xToken;

    httpOptions.headers = httpOptions.headers
      .set('Content-Type', 'image/png')
      .set('X-Auth-Token', xToken);

    return this.http
      .put<string>(`${this.ovhServerUrl}/${fileName}`, file, {
        ...httpOptions,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        })
      );
  }

  private uploadDoc(fileName: string, file: File): Observable<any> {
    if (!this.validateResource(file))
      return throwError(() => new Error('Invalid document'));

    const xToken = this.xTokenObj?.xToken;

    let fileType = file.type;
    let contentType = '';

    if (fileType.startsWith('image')) {
      contentType = 'image/*';
    } else {
      const nameParts = file.name.split('.');
      fileType = nameParts[nameParts.length - 1];

      if (fileType === 'pdf') {
        contentType = 'application/pdf';
      } else if (fileType === 'zip') {
        contentType = 'application/zip';
      } else if (fileType === 'txt') {
        contentType = 'text/plain';
      } else if (fileType === 'doc') {
        contentType = 'application/msword';
      } else if (fileType === 'docx') {
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
    }

    httpOptions.headers = httpOptions.headers
      .set('Content-Type', contentType)
      .set('X-Auth-Token', xToken);

    return this.http
      .put<string>(`${this.ovhServerUrl}/${fileName}`, file, {
        ...httpOptions,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        })
      );
  }

  public removeImage(fileName: string): Observable<any> {
    const xToken = this.xTokenObj?.xToken;

    httpOptions.headers = httpOptions.headers
      .set('Content-Type', 'image/png')
      .set('X-Auth-Token', xToken);

    return this.http
      .delete<any>(`${this.ovhServerUrl}/${fileName}`, httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.messageService.fileUploadAuthError();
    }
  }

  public insertAtCursor(myField: any, myValue: string) {
    //IE support
    if ((document as any).selection) {
      myField.focus();
      const sel = (document as any).selection.createRange();
      sel.text = myValue;
    }
    // Microsoft Edge
    else if (window.navigator.userAgent.indexOf('Edge') > -1) {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;

      myField.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);

      const pos = startPos + myValue.length;
      myField.focus();
      myField.setSelectionRange(pos, pos);
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      myField.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);
    } else {
      myField.value += myValue;
    }
  }

  public deleteFile(
    fileFormControl: FormControl,
    formControlSub?: Subject<any>
  ): Observable<any> {
    const fileName = fileFormControl.value.split('/')[6];
    const fileNameUrl = fileFormControl.value.split('/')[2];

    if (fileNameUrl !== 'storage.gra.cloud.ovh.net') {
      fileFormControl.setValue('');
      formControlSub?.next('');
      return EMPTY;
    }

    return this.removeImage(fileName).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          fileFormControl.setValue('');
          formControlSub?.next('');
        }
        return throwError(() => error);
      })
    );
  }

  public uploadFile(file: any): Observable<any> {
    const fileName = file.data.name;
    file.inProgress = true;

    return this.uploadImage(fileName, file.data).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round((event.loaded * 100) / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((_error: HttpErrorResponse) => {
        file.inProgress = false;
        return throwError(() => 'Upload failed');
      })
    );
  }

  public uploadResourceFile(file: any): Observable<any> {
    const fileName = file.data.name;
    file.inProgress = true;

    return this.uploadDoc(fileName, file.data).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round((event.loaded * 100) / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((_error: HttpErrorResponse) => {
        file.inProgress = false;
        return throwError(() => 'Upload failed');
      })
    );
  }
}
