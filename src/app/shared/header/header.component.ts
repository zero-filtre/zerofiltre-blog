import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  readonly servicesUrl = environment.servicesUrl
  readonly coursesUrl = environment.coursesUrl

  public appLogoUrl = 'https://ik.imagekit.io/lfegvix1p/logoblue_6whym-RBD.svg'

  @Input() changingRoute!: boolean;
  @Input() drawer!: any;

  constructor(
    public authService: AuthService,
    private router: Router,
    public seo: SeoService
  ) { }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
    
  }

}
