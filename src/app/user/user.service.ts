import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    })
  }
}
