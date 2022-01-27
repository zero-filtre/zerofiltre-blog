import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiServerUrl = environment.apiBaseUrl;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public readonly TOKEN_NAME = 'user_profile';
  public isLoggedIn$ = this._isLoggedIn$.asObservable();
  public user!: User;

  get token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  constructor(
    private http: HttpClient
  ) {
    // TODO We may check the expiration date of this token before changing the state of _isLoggedIn$...
    this._isLoggedIn$.next(!!this.token);
    this.user = this.getUser(this.token);
  }

  public login(credentials: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        const token = response.headers.get('authorization').split(' ')[1]
        this._isLoggedIn$.next(true) // Emit the token received as the new value of the currentUser observale with the tap side effect function
        localStorage.setItem(this.TOKEN_NAME, token);
        this.user = this.getUser(token);
      }),
      shareReplay()
    )
  }

  public logout() {
    this._isLoggedIn$.next(false);
    localStorage.removeItem(this.TOKEN_NAME);
  }

  private getUser(token: string): User {
    if (!token) {
      return null!
    }
    return JSON.parse(atob(token.split('.')[1])) as User;
  }
}
