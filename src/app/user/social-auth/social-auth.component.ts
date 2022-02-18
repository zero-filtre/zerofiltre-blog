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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  getGHAccessToken(): void {
    this.authService.getGithubAccessTokenFromCode(this.code).subscribe({
      next: (_response: any) => {
        this.router.navigateByUrl('/');
      },
      error: (_error: HttpErrorResponse) => {
        this.router.navigateByUrl('/login');
      }
    })
  }

  getSOAccessToken(): void {
    if (this.accessToken) {
      this.router.navigateByUrl('/');
      this.authService.SOLogin(this.accessToken);
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