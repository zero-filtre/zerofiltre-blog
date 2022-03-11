import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  readonly apiServerUrl = environment.apiBaseUrl;
  readonly ovhServerUrl = environment.ovhServerUrl;
  private XTOKEN_NAME = 'xToken';

  private subject = new BehaviorSubject<any>(null!);
  public xToken$ = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.loadxToken();
  }

  private loadxToken() {
    console.log('FILE SERVICE STARTED');
    this.xToken$ = this.http.get<any>(`${this.ovhServerUrl}/user`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(xToken => {
          console.log('ME: ', xToken);
          this.subject.next(xToken);
          localStorage.setItem(this.XTOKEN_NAME, xToken);
        })
      )
  }

  get xToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.XTOKEN_NAME);;
    }
  }

  public uploadImage(formData: FormData, fileName: string, file: File): Observable<any> {
    return this.http.put<string>(`${this.ovhServerUrl}/${fileName}`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  public RemoveImage(fileName: string): Observable<any> {
    return this.http.delete<string>(`${this.ovhServerUrl}/${fileName}`)
  }

  public FakeUploadImage() {
    const randomImages = [
      'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY',
      'https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ',
      'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU',
      'https://i.picsum.photos/id/1019/5472/3648.jpg?hmac=2mFzeV1mPbDvR0WmuOWSiW61mf9DDEVPDL0RVvg1HPs',
      'https://i.picsum.photos/id/1029/4887/2759.jpg?hmac=uMSExsgG8_PWwP9he9Y0LQ4bFDLlij7voa9lU9KMXDE',
      'https://i.picsum.photos/id/1047/3264/2448.jpg?hmac=ksy0K4uGgm79hAV7-KvsfHY2ZuPA0Oq1Kii9hqkOCfU'
    ]
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  }
}
