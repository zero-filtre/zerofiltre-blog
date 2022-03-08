import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'image/png',
    'X-Auth-Token': 'my-X-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  readonly apiServerUrl = environment.apiBaseUrl;
  readonly ovhServerUrl = 'https://storage.gra.cloud.ovh.net/v1/AUTH_5159edadfde2413fb43128c1fef06fbf/zerofiltre-object-container';
  readonly XAuthToken = 'gAAAAABiDLRqcvV41hkyqzegG9Y2OtOIlLF__bqDrcnZrskNayaSjOF6QOb9WiFqdQT8coOCP3mAq31iBhdSvWKY7_mq9t4R_9oF0H5ZVALyEglHoa0Cbfvg9fX0jvBYKhPrP_0PFTQn9agP69r1l4t3KwG06tes5uU115Mco_b3Ike_wf3BzM4';

  constructor(private http: HttpClient) { }

  public uploadImage(formData: FormData, fileName: string, file: File): Observable<any> {
    httpOptions.headers = httpOptions.headers.set('X-Auth-Token', `${this.XAuthToken}`);

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
