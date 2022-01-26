import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/message.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly apiServerUrl = environment.apiBaseUrl;

  // private subject$ = new BehaviorSubject<User>(null!);
  // public currentUser$: Observable<User> = this.subject.asObservable();

  // public isLoggedIn!: Observable<boolean>;
  // public isLoggedOut!: Observable<boolean>;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();


  constructor(private http: HttpClient, private messageService: MessageService) {
    // this.isLoggedIn = this.currentUser.pipe(map(user => !!user))
    // this.isLoggedOut = this.isLoggedIn.pipe(map(loggedIn => !loggedIn))

    const token = localStorage.getItem('user_profile')
    // TODO We may check the expiration date of this token before changing the state of _isLoggedIn$...
    this._isLoggedIn$.next(!!token)
  }

  public login(credentials: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/auth`, credentials, {
      observe: 'response'
    }).pipe(
      catchError(error => {
        // this.messageService.loginError();
        return throwError(() => error);
      }),
      tap((response: any) => {
        const token = response.headers.get('authorization').split(' ')[1]
        localStorage.setItem('user_profile', token);
        this._isLoggedIn$.next(true) // Emit the token received as the new value of the currentUser observale with the tap side effect function
      }),
      shareReplay()
    )
  }

  public logout() {
    this._isLoggedIn$.next(false);
  }
}
