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

    if (isPlatformBrowser(this.platformId)) {
      if (this.code) {
        this.getGHAccessToken();
        console.log('SOCIAL AUTH GH CLIENT')
      } else {
        this.getSOAccessToken();
        console.log('SOCIAL AUTH SO CLIENT')
      }
    } else {
      console.log('SOCIAL AUTH SERVER');
    }
  }

}
