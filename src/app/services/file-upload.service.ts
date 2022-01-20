import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public uploadImage(formData: FormData): Observable<any> {
    return this.http.post<string>(`${this.apiServerUrl}/image/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  public RemoveImage(formData: FormData): Observable<any> {
    return this.http.delete<string>(`${this.apiServerUrl}/image/${formData}`)
  }

  public FakeUploadImage(randomImages: []) {
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  }
}
