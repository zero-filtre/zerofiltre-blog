import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, shareReplay, Subject, tap, throwError, map, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  providedIn: 'root'
})
export class FileUploadService {
  readonly apiServerUrl = environment.apiBaseUrl;
  readonly ovhServerUrl = environment.ovhServerUrl;

  private XTOKEN_NAME = 'x_token';

  private subject = new BehaviorSubject<any>(null!);
  public xToken$ = this.subject.asObservable();


  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { 
    this.getOvhToken();
  }

  getOvhToken() {
    this.xToken$ = this.http.get<any>(`${this.apiServerUrl}/ovh/token`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(({ accessToken, expiresAt }: any) => {

          const xToken = accessToken;
          const expireAt = expiresAt;
          const tokenObj = {
            xToken,
            expireAt
          }
          
          this.subject.next(tokenObj);
          localStorage.setItem(this.XTOKEN_NAME, JSON.stringify(tokenObj));
        }),
        shareReplay()
      )
  }

  private extractTokenFromHeaders(response: any) {
    return response.headers.get('X-Subject-Token');
  }

  get xTokenData(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.XTOKEN_NAME);
    }
  }

  get xTokenObj(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(this.xTokenData);
    }
  }

  private validateImage(file: File): boolean {
    let isValid = false;
    const maxSize = 5;

    const sizeUnit = 1024 * 1024;
    const fileSize = Math.round(file.size / sizeUnit);
    const fileType = file.type.split('/')[1]

    if (
      fileType !== 'jpeg' &&
      fileType !== 'png' &&
      fileType !== 'jpg' &&
      fileType !== 'svg' &&
      fileType !== 'pdf') {
      isValid = false
      this.messageService.fileTypeWarning();
    } else if (fileSize > maxSize) {
      isValid = false
      this.messageService.fileSizeWarning(maxSize);
    } else {
      isValid = true;
    }

    return isValid;
  }
  
  validateResource(file: File): boolean {
    let isValid = false;
    const maxSize = 5;
    const acceptedTypes = ['txt', 'doc', 'pdf', 'img'];

    const sizeUnit = 1024 * 1024;
    const fileSize = Math.round(file.size / sizeUnit);
    let fileType = file.type

    if (fileType.startsWith('image')) {
      fileType = 'img'
    } else {
      fileType = fileType.split('/')[1];
    }

    if (!acceptedTypes.includes(fileType)) {
      isValid = false
      this.messageService.openSnackBarWarning("Le document n'est pas au format autorisé ('.txt', '.doc', '.pdf', 'image*')", 'OK')
    } else if (fileSize > maxSize) {
      isValid = false
      this.messageService.fileSizeWarning(maxSize);
    } else {
      isValid = true;
    }

    return isValid;
  }

  private uploadImage(fileName: string, file: File): Observable<any> {
    if (!this.validateImage(file)) return throwError(() => new Error('Invalid file'))

    const xToken = this.xTokenObj?.xToken;

    httpOptions.headers = httpOptions.headers
      .set('Content-Type', 'image/png')
      .set('X-Auth-Token', xToken)

    return this.http.put<string>(`${this.ovhServerUrl}/${fileName}`, file, {
      ...httpOptions,
      reportProgress: true,
      observe: 'events'
    })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error)
        })
      )
  }

  public removeImage(fileName: string): Observable<any> {
    const xToken = this.xTokenObj?.xToken;

    httpOptions.headers = httpOptions.headers
      .set('Content-Type', 'image/png')
      .set('X-Auth-Token', xToken)

    return this.http.delete<any>(`${this.ovhServerUrl}/${fileName}`, httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error)
        })
      )
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
    else if (window.navigator.userAgent.indexOf("Edge") > -1) {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;

      myField.value = myField.value.substring(0, startPos) + myValue
        + myField.value.substring(endPos, myField.value.length);

      const pos = startPos + myValue.length;
      myField.focus();
      myField.setSelectionRange(pos, pos);
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
        + myValue
        + myField.value.substring(endPos, myField.value.length);
    } else {
      myField.value += myValue;
    }
  }

  public deleteFile(
    fileFormControl: FormControl,
    formControlSub?: Subject<any>): Observable<any> {

    const fileName = fileFormControl.value.split('/')[6];
    const fileNameUrl = fileFormControl.value.split('/')[2];

    if (fileNameUrl !== 'storage.gra.cloud.ovh.net') {
      fileFormControl.setValue('');
      formControlSub?.next('');
      return EMPTY;
    }

    return this.removeImage(fileName)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            fileFormControl.setValue('');
            formControlSub?.next('');
          }
          return throwError(() => error)
        })
      )
  }

  public uploadFile(file: any): Observable<any> {
    const fileName = file.data.name
    file.inProgress = true;

    return this.uploadImage(fileName, file.data).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((_error: HttpErrorResponse) => {
        file.inProgress = false;
        return throwError(() => 'Upload failed');
      }))
  }
}
