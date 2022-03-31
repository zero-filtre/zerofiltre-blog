import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  loginWithGithub(): void {
    this.authService.getGithubAccessTokenFromCode(this.code).subscribe({
      next: (_response: any) => {
      },
      error: (_error: HttpErrorResponse) => {
        this.router.navigateByUrl('/login');
      }
    })
  }

  loginWithStackOverflow(): void {
    if (this.accessToken) {
      this.authService.InitSOLoginWithAccessToken(this.accessToken);
    }
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code')!;
    this.accessToken = this.route.snapshot.fragment?.split('=')[1]!;

    if (isPlatformBrowser(this.platformId)) {
      if (this.code) {
        this.loginWithGithub();
      } else {
        this.loginWithStackOverflow();
      }
    }
  }

}
