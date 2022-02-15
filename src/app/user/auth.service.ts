import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiServerUrl = environment.apiBaseUrl;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  public _user$: BehaviorSubject<User>;
  public user$: Observable<User>;

  public TOKEN_NAME!: string;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this._user$ = new BehaviorSubject<User>(null!);
    this.user$ = this._user$.asObservable();

    if (this.token) {
      this.TOKEN_NAME = this.getTokenName(this.token);
      this.loadCurrentUser();
    }

  }

  private loadCurrentUser() {
    if (this.TOKEN_NAME === 'jwt_access_token') {
      const isTokenExpired = this.jwtHelper.isTokenExpired(this.token);
      this._isLoggedIn$.next(!isTokenExpired);
    } else {
      this._isLoggedIn$.next(true);
    }

    // this.http.get<User>(`${this.apiServerUrl}/user`)
    //   .pipe(
    //     catchError(error => {
    //       return throwError(() => error);
    //     }),
    //     tap(usr => {
    //       this._user$.next(usr);
    //     })
    //   )
  }

  get token(): any {
    return localStorage.getItem('jwt_access_token') || localStorage.getItem('gh_access_token') || localStorage.getItem('so_access_token');
  }

  /** This one is to access the jwt by this class for the jwtHelper lib tokenGetter function in the app.module */
  static get token(): any {
    return localStorage.getItem('jwt_access_token');
  }

  private getTokenName(tokenValue: string): string {
    let name = '';
    for (var i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i)!;
      const value = localStorage[key];
      if (value === tokenValue) name = key;
    }
    return name
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
    // localStorage.removeItem(this.TOKEN_NAME);
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

    // this.getUser()
    //   .subscribe({
    //     next: usr => {
    //       this._user$.next(usr);
    //     }
    //   })
  }

  private handleJWTauth(response: any, tokenName: string) {
    const token = this.extractTokenFromHeaders(response)
    this.TOKEN_NAME = tokenName;
    this._isLoggedIn$.next(true) // Emit the token received as the new value of the _isLoggedIn observale with the tap side effect function
    localStorage.setItem(this.TOKEN_NAME, token);

    // this.getUser()
    //   .subscribe({
    //     next: usr => {
    //       this._user$.next(usr);
    //     }
    //   })
  }

  private extractTokenFromHeaders(response: any) {
    return response.headers.get('authorization').split(' ')[1]
  }

  public getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/user`)
  }
}

