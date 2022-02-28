// import { isPlatformBrowser } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiServerUrl = environment.apiBaseUrl;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  private _user$ = new BehaviorSubject<User>(null!);
  public user$ = this._user$.asObservable();

  public TOKEN_NAME!: string;
  public REFRESH_TOKEN_NAME: string = 'refresh_token';
  public isTokenExpired!: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient,
  ) {
    if (this.token && this.token !== undefined) {
      this.TOKEN_NAME = this.getTokenName(this.token);
      this.loadCurrentUser();
    }
  }

  private loadCurrentUser() {
    this.user$ = this.http.get<User>(`${this.apiServerUrl}/user`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(usr => {
          console.log('ME');
          this._user$.next(usr);
        })
      )
  }

  get token(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwt_access_token') || localStorage.getItem('gh_access_token') || localStorage.getItem('so_access_token');
    }
  }

  get refreshToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_NAME);
    }
  }

  get userData(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user_data');
    }
  }

  get currentUsr() {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(this.userData);
    }
  }

  private getTokenName(tokenValue: string): string {
    let name = '';
    if (isPlatformBrowser(this.platformId)) {
      for (var i = 0, len = localStorage.length; i < len; i++) {
        const key = localStorage.key(i)!;
        const value = localStorage[key];
        if (value === tokenValue) name = key;
      }
    }
    return name
  }

  public sendRefreshToken(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  public refreshSocialsToken(tokenName: string): Observable<any> {
    if (tokenName === 'gh_access_token') {
      return this.http.get<any>(`https://github.com/login/oauth/authorize?client_id=${environment.GITHUB_CLIENT_ID}&redirect_uri=${environment.gitHubRedirectURL}&scope=user:email`)
    }
    return this.http.get<any>(`https://stackoverflow.com/oauth/dialog?client_id=${environment.STACK_OVERFLOW_CLIENT_ID}&redirect_uri=${environment.stackOverflowRedirectURL}&scope=no_expiry`)
  }

  public login(credentials: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'jwt_access_token');
      }),
      shareReplay()
    );
  }

  public signup(credentials: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'jwt_access_token');
      }),
      shareReplay()
    )
  }

  public logout() {
    this._isLoggedIn$.next(false);
    this._user$.next(null!);
    localStorage.clear();
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
    return this.http.post<any>(`${this.apiServerUrl}/user/github/accessToken?code=${code}`, {}, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'gh_access_token');
      }),
      shareReplay()
    )
  }

  public SOLogin(token: string) {
    this.TOKEN_NAME = 'so_access_token';
    this._isLoggedIn$.next(true);
    localStorage.setItem(this.TOKEN_NAME, token);

    this.getUser()
      .subscribe({
        next: usr => {
          this._user$.next(usr);
          localStorage.setItem('user_data', JSON.stringify(usr));
        }
      })
  }

  private handleJWTauth(response: any, tokenName: string) {
    const { refreshToken, accessToken } = response.body
    this.TOKEN_NAME = tokenName;
    this._isLoggedIn$.next(true) // Emit the token received as the new value of the _isLoggedIn observale with the tap side effect function
    localStorage.setItem(this.TOKEN_NAME, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_NAME, refreshToken);

    this.getUser()
      .subscribe({
        next: usr => {
          this._user$.next(usr);
          localStorage.setItem('user_data', JSON.stringify(usr));
        }
      })
  }

  private extractTokenFromHeaders(response: any) {
    return response.headers.get('authorization').split(' ')[1]
  }

  public getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/user`)
  }
}

