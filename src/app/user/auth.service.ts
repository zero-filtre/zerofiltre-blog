import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiServerUrl = environment.apiBaseUrl;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public TOKEN_NAME = 'jwt_access_token';
  public isLoggedIn$ = this._isLoggedIn$.asObservable();
  public user!: User;

  get token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  static get token(): any {
    return localStorage.getItem('jwt_access_token');
  }

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    const isTokenExpired = this.jwtHelper.isTokenExpired(this.token);
    console.log('IS TOKEN EXPIRED: ', isTokenExpired);

    this._isLoggedIn$.next(!isTokenExpired);
    this.user = this.getUser(this.token);
  }

  public login(credentials: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        const token = response.headers.get('authorization').split(' ')[1]
        this._isLoggedIn$.next(true) // Emit the token received as the new value of the _isLoggedIn observale with the tap side effect function
        localStorage.setItem(this.TOKEN_NAME, token);
        this.user = this.getUser(token);
      }),
      shareReplay()
    )
  }

  public signup(credentials: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        const token = response.headers.get('authorization').split(' ')[1]
        this._isLoggedIn$.next(true) // Emit the token received as the new value of the _isLoggedIn observale with the tap side effect function
        localStorage.setItem(this.TOKEN_NAME, token);
        this.user = response;
      }),
      shareReplay()
    )
  }

  public logout() {
    this._isLoggedIn$.next(false);
    localStorage.removeItem(this.TOKEN_NAME);
  }

  public requestPasswordReset(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/initPasswordReset?email=${email}`, {
      responseType: 'text' as 'json'
    })
  }

  public verifyTokenForPasswordReset(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/verifyTokenForPasswordReset?token=${token}`)
  }

  public savePasswordReset(values: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/savePasswordReset`, values, {
      responseType: 'text' as 'json'
    })
  }

  public registrationConfirm(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/registrationConfirm?token=${token}`, {
      responseType: 'text' as 'json'
    })
  }

  public resendUserConfirm(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/resendRegistrationConfirm?email=${email}`, {
      responseType: 'text' as 'json'
    })
  }

  public getGithubAccessTokenFromCode(code: string, client_id: string, client_secret: string): Observable<any> {
    return this.http.post<any>(`https://github.com/login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${client_secret}`, {
      responseType: 'text' as 'json'
    })
      .pipe(
        tap((_response: any) => {
          this.TOKEN_NAME = 'gh_access_token';
          this._isLoggedIn$.next(true);
        }),
        shareReplay()
      )
  }

  public getGHUser(): Observable<any> {
    return this.http.get<any>('https://api.github.com/user');
  }

  private getUser(token: string): User {
    if (!token) {
      return null!
    }
    return JSON.parse(atob(token.split('.')[1])) as User;
  }
}
