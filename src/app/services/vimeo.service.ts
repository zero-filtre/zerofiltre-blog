import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VimeoService {

  constructor(
    private http: HttpClient
  ) { }

  getOneVideo(): Observable<any> {
    const ramdomurls = [
      "https://vimeo.com/355927009",
      "https://vimeo.com/76979871?h=8272103f6e",
      "https://vimeo.com/59569869",
      // "https://vimeo.com/137307669",
      // "https://vimeo.com/59295969",
      // "https://vimeo.com/53170050",
      // "https://vimeo.com/52431946",
    ]

    const url =
      ramdomurls[
      Math.floor(Math.random() * ramdomurls.length)
      ];

    return of(url)
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
}
