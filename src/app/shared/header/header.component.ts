import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  readonly servicesUrl = environment.servicesUrl;
  readonly coursesUrl = environment.coursesUrl;
  readonly blogUrl = environment.blogUrl;
  readonly activeCourseModule = environment.courseRoutesActive === 'true';

  appLogoUrl = 'https://ik.imagekit.io/lfegvix1p/logoblue_6whym-RBD.svg'

  prod = this.blogUrl.startsWith('https://dev.') ? false : true;

  @Input() changingRoute!: boolean;
  @Input() drawer!: any;

  constructor(
    private loadEnvService: LoadEnvService,
    public authService: AuthService,
    private router: Router,
    public seo: SeoService
  ) { }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
    // do nothing.
  }

}
