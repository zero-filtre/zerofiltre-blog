import { HttpClient } from '@angular/common/http';
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

  public login(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/login`, credentials)
  }
}
