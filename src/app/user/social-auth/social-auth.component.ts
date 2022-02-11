import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.css']
})
export class SocialAuthComponent implements OnInit {
  private code!: string;
  private accessToken!: string;
  private soKey = 'ZAeo5W0MnZPxiEBgb99MvA((';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  getGHAccessToken(): void {
    this.authService.getGithubAccessTokenFromCode(this.code).subscribe({
      next: (_response: any) => {
        this.router.navigateByUrl('/');

        this.authService.getGHUser().subscribe({
          next: (response: any) => {
            this.authService.user = response;
            console.log('AUTHING GH USER: ', response);
          }
        })
      },
      error: (_error: HttpErrorResponse) => {
        this.router.navigateByUrl('/login');
      }
    })
  }

  getSOAccessToken(): void {
    if (this.accessToken) {
      this.router.navigateByUrl('/');
      this.authService.SOLogin();
      localStorage.setItem(this.authService.TOKEN_NAME, this.accessToken);

      this.authService.getSOUser(this.soKey, this.accessToken).subscribe({
        next: (response: any) => {
          this.authService.user = response;
          console.log('AUTHING SO USER: ', response);
        }
      })
    }
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code')!;
    this.accessToken = this.route.snapshot.fragment?.split('=')[1]!;

    if (this.code) {
      this.getGHAccessToken();
    } else {
      this.getSOAccessToken();
    }

  }

}
