import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, of } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

const apiBase = 'https://api.vimeo.com';

@Injectable({
  providedIn: 'root'
})
export class VimeoService {
  readonly apiServerUrl = environment.apiBaseUrl;
  readonly accessToken = environment.vimeoToken;
  readonly clientID = environment.vimeoClientID;
  readonly clientSecret = environment.vimeoClientSecret;

  constructor(
    private http: HttpClient
  ) { }

  getVideo(videoID: string): Observable<any> {
    httpOptions.headers = httpOptions.headers
      .set('Authorization', `bearer ${this.accessToken}`)

    return this.http.get<any>(`${apiBase}/videos/${videoID}`, httpOptions)
  }

  getOneVideo(link: string): Observable<any> {
    return of(link)
      .pipe(
        map(data => data),
        shareReplay()
      )
  }

  getAllVideos(user: any): Observable<any[]> {
    return this.http.get<any[]>('https://vimeo.com/api/v2/' + user + '/videos.json')
      .pipe(
        map(data => data),
        shareReplay()
      )
  }

  getEmbedLink(url: string): Observable<any> {
    return this.http.get('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/76979871')
      .pipe(
        map(data => data),
        shareReplay()
      )
  }

  initVideoUpload(file: File, name=null): Observable<any> {
    const fileSize = file.size;
    const fileName = name ? name : file.name;
    return this.http.post<any>(`${this.apiServerUrl}/vimeo/init?size=${fileSize}&name=${fileName}`, httpOptions)
      .pipe(shareReplay())
  }

  uploadVideoFileTus(url: string, fileData: any, offset: number): Observable<any> {
    httpOptions.headers = httpOptions.headers
      .set('Tus-Resumable', '1.0.0')
      .set('Upload-Offset', `${offset}`)
      .set('Content-Type', 'application/offset+octet-stream')

    return this.http.patch<any>(url, fileData, {
      ...httpOptions,
      reportProgress: true,
      observe: 'events',
    })
      .pipe(shareReplay())
  }

  deleteVideoFile(videoID: string): Observable<any> {
    httpOptions.headers = httpOptions.headers
      .set('Authorization', `bearer ${this.accessToken}`)

    return this.http.delete<any>(`${this.apiServerUrl}/videos/${videoID}`, httpOptions)
      .pipe(shareReplay())
  }

  getDuration(videoUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // window.onload = () => {
        const player = new window["Vimeo"].Player(videoUrl);
        player.getDuration().then(duration => {
          resolve(duration);
        }).catch(error => {
          reject(error);
        });
      // }
    });
  }

}
