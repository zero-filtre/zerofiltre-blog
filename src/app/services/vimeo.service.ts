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

  postVideo(file: File): Observable<any> {
    const fileSize = file.size;

    httpOptions.headers = httpOptions.headers
      .set('Authorization', `bearer ${this.accessToken}`)
      .set('Accept', 'application/vnd.vimeo.*+json;version=3.4')

    const body = {
      "upload": {
        "approach": "tus",
        "size": fileSize,
      }
    }

    return this.http.post<any>(`${apiBase}/me/videos`, body, httpOptions)
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

    return this.http.delete<any>(`${apiBase}/videos/${videoID}`, httpOptions)
      .pipe(shareReplay())
  }

}
