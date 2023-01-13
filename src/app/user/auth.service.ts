import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CourseService } from '../school/courses/course.service';
import { MessageService } from '../services/message.service';
import { User } from './user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

const fakeCourseIds = [];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly apiServerUrl = environment.apiBaseUrl;

  private subject = new BehaviorSubject<User>(null!);
  public user$ = this.subject.asObservable();

  public isLoggedIn$!: Observable<boolean>;
  public isLoggedOut$!: Observable<boolean>;

  public TOKEN_NAME: string = 'access_token';
  public REFRESH_TOKEN_NAME: string = 'refresh_token';

  private redirectURL: string;

  public isAdmin: boolean;

  private refreshData!: boolean

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private courseService: CourseService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.isLoggedIn$ = of(this.currentUsr).pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

    this.redirectURL = '';
    this.isAdmin = this.currentUsr ? this.checkRole(this.currentUsr?.roles, 'ROLE_ADMIN') : false;

    this.loadCurrentUser();
  }


  private loadCurrentUser() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.refreshData) {
        httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
      }

      this.user$ = this.http.get<User>(`${this.apiServerUrl}/user`)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          }),
          tap(usr => {
            this.subject.next(usr);
            this.setUserData(usr);
            this.refreshData = false
            httpOptions.headers = httpOptions.headers.delete('x-refresh');
          }),
          shareReplay()
        )
    }
  }

  refreshUser(): Observable<any> {
    return this.http.get<User>(`${this.apiServerUrl}/user`)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(usr => {
          this.subject.next(usr);
          this.setUserData(usr);
          this.refreshData = false;
          httpOptions.headers = httpOptions.headers.delete('x-refresh');

          this.courseService.getAllSubscribedCourseIds(usr.id)
            .pipe(tap(data => {
              this.setUserData({ ...usr, courseIds: [...new Set(data)] })
              this.isAdmin = this.checkRole(usr.roles, 'ROLE_ADMIN');
            })).subscribe()
        }),
        shareReplay()
      )
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

  get tokenExpiryDate(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('_tokenExpiryDate');
    }
  }

  get refreshTokenExpiryDate(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('_refreshExpiryDate');
    }
  }

  get lastLoggedDate(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('_lastLoggedDate');
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

  setUserData(user: User) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  setRedirectUrlValue(redirectURL: string) {
    this.redirectURL = redirectURL;
  }

  sendRefreshToken(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/jwt/refreshToken?refreshToken=${this.refreshToken}`)
      .pipe(
        tap(({ accessToken, refreshToken }) => {
          localStorage.setItem(this.TOKEN_NAME, accessToken);
          localStorage.setItem(this.REFRESH_TOKEN_NAME, refreshToken);
        })
      )
  }

  login(credentials: FormData, redirectURL: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'Bearer', redirectURL);
      }),
      shareReplay()
    );
  }

  signup(credentials: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user`, credentials, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'Bearer');
      }),
      shareReplay()
    )
  }

  logout() {
    this.subject.next(null!);
    this.clearLSwithoutExcludedKey()
    this.isAdmin = false;
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/initPasswordReset?email=${email}`, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  verifyTokenForPasswordReset(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/verifyTokenForPasswordReset?token=${token}`)
      .pipe(shareReplay())
  }

  savePasswordReset(values: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/savePasswordReset`, values, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  registrationConfirm(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/registrationConfirm?token=${token}`, {
      responseType: 'text' as 'json'
    }).pipe(
      tap(_ => this.refreshData = true),
      shareReplay()
    );
  }

  resendUserConfirm(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/user/resendRegistrationConfirm?email=${email}`, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  getGithubAccessTokenFromCode(code: string): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/user/github/accessToken?code=${code}`, {}, {
      observe: 'response'
    }).pipe(
      tap((response: any) => {
        this.handleJWTauth(response, 'token');
      }),
      shareReplay()
    )
  }

  InitSOLoginWithAccessToken(accessToken: string) {
    this.loadLoggedInUser(accessToken, 'stack');
  }


  // USER PROFILE SERVICES

  updateUserPassword(passwords: FormData): Observable<any> {
    return this.http.post<string>(`${this.apiServerUrl}/user/updatePassword`, passwords, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }

  updateUserProfile(profile: any): Observable<User> {
    return this.http.patch<User>(`${this.apiServerUrl}/user`, profile)
      .pipe(
        tap(_ => this.refreshData = true),
        shareReplay()
      );
  }

  findUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/user/profile/${userId}`)
      .pipe(
        shareReplay()
      )
  }

  deleteUserAccount(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/user/${userId}`, {
      responseType: 'text' as 'json'
    }).pipe(shareReplay())
  }


  // HELPER SERVICES

  private handleJWTauth(response: any, tokenType: string, redirectURL = '') {
    const { refreshToken, accessToken, accessTokenExpiryDateInSeconds, refreshTokenExpiryDateInSeconds } = response.body

    localStorage.setItem('_lastLoggedDate', Date.now().toString());
    localStorage.setItem('_tokenExpiryDate', accessTokenExpiryDateInSeconds);
    localStorage.setItem('_refreshExpiryDate', refreshTokenExpiryDateInSeconds);

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

          this.setUserData(usr)
          this.isAdmin = this.checkRole(usr.roles, 'ROLE_ADMIN');

          if (this.redirectURL) {
            this.router.navigateByUrl(this.redirectURL)
          } else {
            this.router.navigateByUrl('/articles');
          }

          this.courseService.getAllSubscribedCourseIds(usr.id)
            .pipe(tap(data => {
              this.setUserData({ ...usr, courseIds: [...new Set(data)] })
            })).subscribe()
        },
        error: (_err: HttpErrorResponse) => {
          this.messageService.loadUserFailed();
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

