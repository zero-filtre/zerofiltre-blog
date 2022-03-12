import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Container-Meta-Access-Control-Allow-Origin': '*'
  }),
};

const STATE_KEY_X_TOKEN = makeStateKey('x-token-value');

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  readonly apiServerUrl = environment.apiBaseUrl;
  readonly ovhServerUrl = environment.ovhServerUrl;
  readonly ovhTokenUrl = environment.ovhTokenUrl;
  private XTOKEN_NAME = 'xToken';

  private subject = new BehaviorSubject<any>(null!);
  public xToken$ = this.subject.asObservable();

  public xTokenServerValue!: any;

  constructor(
    private state: TransferState,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.loadxToken();
  }

  private loadxToken() {

    const body = {
      "auth": {
        "identity": {
          "methods": [
            "password"
          ],
          "password": {
            "user": {
              "name": "user-kBB6rJAw6Vgt",
              "domain": {
                "id": "default"
              },
              "password": "SgKaxtFtpNCy9uXJAAyhJzHjrPxYG6pd"
            }
          }
        }
      }
    }

    this.xTokenServerValue = this.state.get(STATE_KEY_X_TOKEN, <any>null);

    if (this.xTokenServerValue && isPlatformBrowser(this.platformId)) {
      console.log('SERVER TOKEN VALUE: ', this.xTokenServerValue);

      this.subject.next(this.xTokenServerValue);
      localStorage.setItem(this.XTOKEN_NAME, JSON.stringify(this.xTokenServerValue));
    }

    if (!this.xTokenServerValue) {
      this.xToken$ = this.http.post<any>(`${this.ovhTokenUrl}`, body, {
        ...httpOptions,
        observe: 'response'
      })
        .pipe(
          catchError(error => {
            return throwError(() => error);
          }),
          tap(response => {
            const xToken = this.extractTokenFromHeaders(response);
            const expireAt = response.body.token.expires_at;
            const tokenObj = {
              xToken,
              expireAt
            }
            console.log('X-TOKEN: ', tokenObj);
            this.state.set(STATE_KEY_X_TOKEN, <any>tokenObj);
            this.subject.next(tokenObj);
          }),
          shareReplay()
        )
    }

    // this.xToken$ = this.http.get<any>(`${this.ovhServerUrl}`, {
    //   ...httpOptions,
    //   observe: 'response'
    // })
    //   .pipe(
    //     catchError(error => {
    //       return throwError(() => error);
    //     }),
    //     tap(response => {
    //       console.log('RESPONSE: ', response);
    //     }),
    //     shareReplay()
    //   )
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

  public uploadImage(fileName: string, file: File): Observable<any> {
    const xToken = this.xTokenObj?.xToken || 'my-x-token';

    httpOptions.headers = httpOptions.headers
      .set('Content-Type', 'image/png')
      .set('X-Auth-Token', xToken)

    return this.http.put<string>(`${this.ovhServerUrl}/${fileName}`, file, {
      ...httpOptions,
      reportProgress: true,
      observe: 'events'
    })
  }

  public RemoveImage(fileName: string): Observable<any> {
    const xToken = this.xTokenObj?.xToken || 'my-x-token';

    httpOptions.headers = httpOptions.headers
      .set('Content-Type', 'image/png')
      .set('X-Auth-Token', xToken)

    return this.http.delete<string>(`${this.ovhServerUrl}/${fileName}`, httpOptions)
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
