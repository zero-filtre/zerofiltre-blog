import { Component, OnInit } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  user$: Observable<User>;
  loading: boolean;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true
    this.user$ = this.authService.refreshUser()
      .pipe(
        catchError(error => {
          this.loading = false
          return throwError(() => error);
        }),
        tap(_data => this.loading = false)
      )

    this.authService.loadUserAllSubs();
  }

}
