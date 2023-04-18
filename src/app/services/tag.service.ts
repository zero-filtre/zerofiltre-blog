import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tag } from '../articles/article.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TagService {
  readonly apiServerUrl = environment.apiBaseUrl;

  private tagSubject$ = new BehaviorSubject<Tag[]>([]);
  public tags$: Observable<Tag[]> = this.tagSubject$.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getListOfTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiServerUrl}/tag`)
      .pipe(shareReplay());
  }
}
