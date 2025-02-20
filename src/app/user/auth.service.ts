import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CourseService } from '../school/courses/course.service';
import { CourseEnrollment } from '../school/studentCourse';
import { MessageService } from '../services/message.service';
import { PLANS, ROLES, RoleType, User } from './user.model';
import { FileUploadService } from '../services/file-upload.service';
import { ModalService } from '../services/modal.service';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiryDateInSeconds: number;
  refreshTokenExpiryDateInSeconds: number;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly apiServerUrl = environment.apiBaseUrl;

  private readonly subject = new BehaviorSubject<User | null>(null);
  public user$ = this.subject.asObservable();

  private readonly userEnrollmentsSubject = new BehaviorSubject<
    CourseEnrollment[]
  >([]);
  public userEnrollments$ = this.userEnrollmentsSubject.asObservable();

  public isLoggedIn$: Observable<boolean>;
  public isLoggedOut$: Observable<boolean>;

  public readonly TOKEN_NAME = 'access_token';
  public readonly REFRESH_TOKEN_NAME = 'refresh_token';

  private redirectURL = '';

  public isAdmin = false;
  public isPro = false;

  private refreshData = false;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly courseService: CourseService,
    private readonly fileUploadService: FileUploadService,
    private readonly modalService: ModalService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.isLoggedIn$ = of(this.currentUsr).pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

    this.isAdmin = this.currentUsr
      ? this.checkRole(this.currentUsr?.roles, ROLES.ADMIN)
      : false;
    this.isPro = this.currentUsr ? this.currentUsr.plan === PLANS.PRO : false;

    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.refreshData) {
        httpOptions.headers = httpOptions.headers.set('x-refresh', 'true');
      }

      this.user$ = this.http.get<User>(`${this.apiServerUrl}/user`).pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
        tap((usr) => {
          this.subject.next(usr);
          this.setUserData(usr);
          this.refreshData = false;
          httpOptions.headers = httpOptions.headers.delete('x-refresh');
        }),
        shareReplay()
      );
    }
  }

  refreshUser(): Observable<any> {
    return this.http.get<User>(`${this.apiServerUrl}/user`).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      tap((usr) => {
        this.subject.next(usr);
        this.setUserData(usr);
        this.refreshData = false;
        httpOptions.headers = httpOptions.headers.delete('x-refresh');
      }),
      shareReplay()
    );
  }

  get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_NAME);
    }
    return null;
  }

  get refreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_NAME);
    }
    return null;
  }

  get tokenExpiryDate(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('_tokenExpiryDate');
    }
    return null;
  }

  get refreshTokenExpiryDate(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('_refreshExpiryDate');
    }
    return null;
  }

  get lastLoggedDate(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('_lastLoggedDate');
    }
    return null;
  }

  get userData(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user_data');
    }
    return null;
  }

  get currentUsr(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const data = this.userData;
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  get canAccessAdminDashboard(): boolean {
    return this.isAdmin;
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
    return this.http
      .get<any>(
        `${this.apiServerUrl}/user/jwt/refreshToken?refreshToken=${this.refreshToken}`
      )
      .pipe(
        tap(({ accessToken, refreshToken }) => {
          localStorage.setItem(this.TOKEN_NAME, accessToken);
          localStorage.setItem(this.REFRESH_TOKEN_NAME, refreshToken);
        })
      );
  }

  login(credentials: FormData, redirectURL: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiServerUrl}/auth`, credentials, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.body) {
            this.handleJWTauth({ body: response.body }, 'Bearer', redirectURL);
            return response.body;
          }
          throw new Error('Empty response body');
        }),
        shareReplay()
      );
  }

  signup(credentials: FormData): Observable<User> {
    return this.http
      .post<TokenResponse>(`${this.apiServerUrl}/user`, credentials, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.body) {
            this.handleJWTauth({ body: response.body }, 'Bearer');
            return this.currentUsr as User;
          }
          throw new Error('Empty response body');
        }),
        shareReplay()
      );
  }

  logout() {
    // if (confirm("Voulez-vous vraiment vous deconnecter ?")) {
    // }
    this.subject.next(null!);
    this.clearLSwithoutExcludedKey();
    this.isAdmin = false;
    this.isPro = false;
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiServerUrl}/user/initPasswordReset?email=${email}`, {
        responseType: 'text' as 'json',
      })
      .pipe(shareReplay());
  }

  verifyTokenForPasswordReset(token: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiServerUrl}/user/verifyTokenForPasswordReset?token=${token}`
      )
      .pipe(shareReplay());
  }

  savePasswordReset(values: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiServerUrl}/user/savePasswordReset`, values, {
        responseType: 'text' as 'json',
      })
      .pipe(shareReplay());
  }

  registrationConfirm(token: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiServerUrl}/user/registrationConfirm?token=${token}`,
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap((_) => (this.refreshData = true)),
        shareReplay()
      );
  }

  resendUserConfirm(email: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiServerUrl}/user/resendRegistrationConfirm?email=${email}`,
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(shareReplay());
  }

  getGithubAccessTokenFromCode(code: string): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiServerUrl}/user/github/accessToken?code=${code}`,
        {},
        {
          observe: 'response',
        }
      )
      .pipe(
        tap((response: any) => {
          this.handleJWTauth(response, 'token');
        }),
        shareReplay()
      );
  }

  InitSOLoginWithAccessToken(accessToken: string) {
    this.loadLoggedInUser(accessToken, 'stack');
  }

  // USER PROFILE SERVICES

  updateUserPassword(passwords: FormData): Observable<any> {
    return this.http
      .post<string>(`${this.apiServerUrl}/user/updatePassword`, passwords, {
        responseType: 'text' as 'json',
      })
      .pipe(shareReplay());
  }

  updateUserEmail(emails: FormData): Observable<any> {
    return this.http
      .post<string>(`${this.apiServerUrl}/user/updateEmail`, emails, {
        responseType: 'text' as 'json',
      })
      .pipe(shareReplay());
  }

  updateUserProfile(profile: any): Observable<User> {
    return this.http.patch<User>(`${this.apiServerUrl}/user`, profile).pipe(
      tap((_) => (this.refreshData = true)),
      shareReplay()
    );
  }

  findUserProfile(userId: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiServerUrl}/user/profile/${userId}`)
      .pipe(shareReplay());
  }

  deleteUserAccount(userId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiServerUrl}/user/${userId}`, {
        responseType: 'text' as 'json',
      })
      .pipe(shareReplay());
  }

  // HELPER SERVICES

  private handleJWTauth(
    response: { body: TokenResponse },
    tokenType: string,
    redirectURL = ''
  ): void {
    const {
      refreshToken,
      accessToken,
      accessTokenExpiryDateInSeconds,
      refreshTokenExpiryDateInSeconds,
    } = response.body;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('_lastLoggedDate', Date.now().toString());
      localStorage.setItem(
        '_tokenExpiryDate',
        accessTokenExpiryDateInSeconds.toString()
      );
      localStorage.setItem(
        '_refreshExpiryDate',
        refreshTokenExpiryDateInSeconds.toString()
      );
    }

    this.redirectURL = redirectURL;
    this.loadLoggedInUser(accessToken, tokenType, refreshToken);
  }

  private getUser(accessToken: string, tokenType: string): Observable<User> {
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      `${tokenType} ${accessToken}`
    );

    return this.http
      .get<User>(`${this.apiServerUrl}/user`, httpOptions)
      .pipe(shareReplay());
  }

  loadUserAllSubs(): void {
    this.courseService
      .findAllSubscribedCourses({ pageNumber: 0, pageSize: 1000 })
      .pipe(
        tap(({ content }) => {
          this.userEnrollmentsSubject.next(content);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(
              '_subs',
              JSON.stringify(content.map((d: CourseEnrollment) => d.id))
            );
          }
        })
      )
      .subscribe();
  }

  private loadLoggedInUser(
    accessToken: string,
    tokenType: string,
    refreshToken = ''
  ): void {
    this.getUser(accessToken, tokenType).subscribe({
      next: (usr) => {
        if (!usr) return;

        this.subject.next(usr);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.TOKEN_NAME, accessToken);
          if (refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_NAME, refreshToken);
          }
          this.setUserData(usr);
        }

        this.fileUploadService.getOvhToken();
        this.fileUploadService.xToken$.subscribe();
        this.isAdmin = this.checkRole(usr.roles, ROLES.ADMIN);
        this.isPro = usr.plan === PLANS.PRO;

        if (this.redirectURL) {
          this.router.navigateByUrl(this.redirectURL);
        } else {
          this.router.navigateByUrl('/cours');
        }

        this.modalService.checkUserEmail(usr);
        this.loadUserAllSubs();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.loadUserFailed();
        this.router.navigateByUrl('/login');
      },
    });
  }

  private clearLSwithoutExcludedKey(): void {
    const excludedKey = 'lastTipDate';
    if (isPlatformBrowser(this.platformId)) {
      const keys = Array.from({ length: localStorage.length }, (_, i) =>
        localStorage.key(i)
      );
      const clearables = keys.filter((key) => key !== excludedKey);
      clearables.forEach((key) => key && localStorage.removeItem(key));
    }
  }

  private checkRole(roles: RoleType[] | undefined, role: string): boolean {
    return roles?.includes(role as RoleType) || false;
  }

  private extractTokenFromHeaders(response: any) {
    return response.headers.get('authorization').split(' ')[1];
  }

  private getTokenName(tokenValue: string): string {
    let name = '';
    if (isPlatformBrowser(this.platformId)) {
      for (let i = 0, len = localStorage.length; i < len; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage[key];
          if (value === tokenValue) name = key;
        }
      }
    }
    return name;
  }
}

