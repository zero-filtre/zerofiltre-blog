import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  public TOKEN_NAME!: string;
  public isLoggedIn$ = this._isLoggedIn$.asObservable();
  public user!: User;

  get token(): any {
    return localStorage.getItem('jwt_access_token') || localStorage.getItem('gh_access_token') || localStorage.getItem('so_access_token');
  }

  static get token(): any {
    return localStorage.getItem('jwt_access_token');
  }

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    if (this.token) this.TOKEN_NAME = localStorage.key(0)!;

    if (this.TOKEN_NAME === 'jwt_access_token') {
      const isTokenExpired = this.jwtHelper.isTokenExpired(this.token);
      console.log('IS JWT TOKEN EXPIRED: ', isTokenExpired);

      this._isLoggedIn$.next(!isTokenExpired);
      this.user = this.getUser(this.token);
    } else {
      this._isLoggedIn$.next(!!this.token);
    }

    console.log('CTOR USER: ', this.user);
  }

  public login(credentials: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response);
      }),
      shareReplay()
    )
  }

  public signup(credentials: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response);
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

  public getGithubAccessTokenFromCode(code: string): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/github/accessToken?code=${code}`, {
      observe: 'response'
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

  public SOLogin() {
    this.TOKEN_NAME = 'so_access_token';
    this._isLoggedIn$.next(true);
  }

  public getSOUser(): Observable<any> {
    return this.http.get<any>('https://api.stackexchange.com/me');
  }

  private handleJWTauth(response: any) {
    const token = this.extractTokenFromHeaders(response)
    this.TOKEN_NAME = 'jwt_access_token';
    this._isLoggedIn$.next(true) // Emit the token received as the new value of the _isLoggedIn observale with the tap side effect function
    localStorage.setItem(this.TOKEN_NAME, token);
    this.user = response;
  }

  private extractTokenFromHeaders(response: any) {
    return response.headers.get('authorization').split(' ')[1]
  }

  private getUser(token: string): User {
    if (!token) {
      return null!
    }
    return JSON.parse(atob(token.split('.')[1])) as User;
  }
}
