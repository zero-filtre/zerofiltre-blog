import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, retryWhen, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/message.service';
import { genericRetryPolicy } from '../services/utilities.service';
import { User } from './user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiServerUrl = environment.apiBaseUrl;

  private subject = new BehaviorSubject<User>(null!);
  public user$ = this.subject.asObservable();

  public isLoggedIn$!: Observable<boolean>;
  public isLoggedOut$!: Observable<boolean>;

  public TOKEN_NAME: string = 'access_token';
  public REFRESH_TOKEN_NAME: string = 'refresh_token';

  private redirectURL: string;

  public isAdmin!: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {
    // this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isLoggedIn$ = of(this.currentUsr).pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

    this.redirectURL = '';
    this.isAdmin = this.checkRole(this.currentUsr?.roles, 'ROLE_ADMIN');

    this.loadCurrentUser();
  }


  // AUTH SERVICES

  private loadCurrentUser() {
    if (isPlatformBrowser(this.platformId)) {
      this.user$ = this.http.get<User>(`${this.apiServerUrl}/user`)
        .pipe(
          catchError(error => {
            console.log('ME ERROR: ', error);
            return throwError(() => error);
          }),
          tap(usr => {
            console.log('ME: ', usr);
            this.subject.next(usr);
            this.setUserData(usr);
          })
        )
    }
  }

  get token(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_NAME);;
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

  public setUserData(user: User) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  public setRedirectUrlValue(redirectURL: string) {
    this.redirectURL = redirectURL;
  }

  public sendRefreshToken(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/jwt/refreshToken?refreshToken=${this.refreshToken}`)
      .pipe(
        tap(({ accessToken, refreshToken }) => {
          localStorage.setItem(this.TOKEN_NAME, accessToken);
          localStorage.setItem(this.REFRESH_TOKEN_NAME, refreshToken);
        })
      )
  }

  public login(credentials: FormData, redirectURL: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'Bearer', redirectURL);
      }),
      shareReplay()
    );
  }

  public signup(credentials: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'Bearer');
      }),
      shareReplay()
    )
  }

  public logout() {
    this.subject.next(null!);
    this.clearLSwithoutExcludedKey()
  }

  public requestPasswordReset(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/initPasswordReset?email=${email}`, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  public verifyTokenForPasswordReset(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/verifyTokenForPasswordReset?token=${token}`)
      .pipe(shareReplay())
  }

  public savePasswordReset(values: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/savePasswordReset`, values, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  public registrationConfirm(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/registrationConfirm?token=${token}`, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  public resendUserConfirm(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/resendRegistrationConfirm?email=${email}`, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  public getGithubAccessTokenFromCode(code: string): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/github/accessToken?code=${code}`, {}, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'token');
      }),
      shareReplay()
    )
  }

  public InitSOLoginWithAccessToken(accessToken: string) {
    this.loadLoggedInUser(accessToken, 'stack');
  }


  // USER PROFILE SERVICES

  public updateUserPassword(passwords: FormData): Observable<any> {
    return this.http.post<string>(`${this.apiServerUrl}/user/updatePassword`, passwords, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  public updateUserProfile(profile: any): Observable<User> {
    return this.http.patch<User>(`${this.apiServerUrl}/user`, profile).pipe(
      shareReplay()
    )
  }

  public findUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/user/profile/${userId}`)
      .pipe(
        shareReplay()
      )
  }

  public deleteUserAccount(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/user/${userId}`, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }


  // HELPER SERVICES

  private handleJWTauth(response: any, tokenType: string, redirectURL = '') {
    const { refreshToken, accessToken } = response.body
    this.redirectURL = redirectURL;
    this.loadLoggedInUser(accessToken, tokenType, refreshToken);
  }

  private getUser(accessToken: string, tokenType: string): Observable<User> {
    httpOptions.headers = httpOptions.headers.set('Authorization', `${tokenType} ${accessToken}`);

    return this.http.get<User>(`${this.apiServerUrl}/user`, httpOptions).pipe(
      shareReplay()
    )
  }

  private loadLoggedInUser(accessToken: string, tokenType: string, refreshToken = '') {
    this.getUser(accessToken, tokenType)
      .subscribe({
        next: usr => {
          this.subject.next(usr);
          localStorage.setItem(this.TOKEN_NAME, accessToken);
          if (refreshToken) localStorage.setItem(this.REFRESH_TOKEN_NAME, refreshToken);
          localStorage.setItem('user_data', JSON.stringify(usr));
          this.isAdmin = this.checkRole(this.currentUsr?.roles, 'ROLE_ADMIN');

          if (this.redirectURL) {
            this.router.navigateByUrl(this.redirectURL)
          } else {
            this.router.navigateByUrl('/');
          }
        },
        error: (_err: HttpErrorResponse) => {
          this.messageService.openSnackBarError('Impossible de recupérer vos données. Veuillez reessayer !', 'Ok', 0);
          this.router.navigateByUrl('/login');
        }
      })
  }

  private clearLSwithoutExcludedKey() {
    const excludedKey = 'x_token'
    const keys = []
    if (isPlatformBrowser(this.platformId)) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        keys.push(key)
      }
      const clearables = keys.filter(key => key !== excludedKey)
      clearables.forEach(key => localStorage.removeItem(key!))
    }
  }

  private checkRole(roles: string[], role: string): boolean {
    // return roles?.some((role: string) => role === role);
    return roles?.includes(role);
  }

  private extractTokenFromHeaders(response: any) {
    return response.headers.get('authorization').split(' ')[1]
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
}

