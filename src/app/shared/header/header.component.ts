import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { ModalService } from 'src/app/services/modal.service';
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

  logoFull = 'https://ik.imagekit.io/lfegvix1p/Logo%20Horizontal_CPY64pImj.svg'
  logoShort = 'https://ik.imagekit.io/lfegvix1p/Logo%20Symbole_fFcHDpP7s.svg'

  prod = this.blogUrl.startsWith('https://dev.') ? false : true;

  @Input() changingRoute!: boolean;
  @Input() drawer!: any;

  readonly bannerText = environment.bannerText;
  readonly bannerLink = environment.bannerLink;
  readonly bannerActionBtn  = environment.bannerActionBtn;
  readonly bannerBgColor  = environment.bannerBgColor;
  readonly isBannerVisible = environment.bannerVisible === 'true';

  isSearchModalOpen = false;
  isDarkMode: boolean;

  constructor(
    private loadEnvService: LoadEnvService,
    public authService: AuthService,
    private router: Router,
    public seo: SeoService,
    private modaleService: ModalService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  subscribeToPro() {
    this.router.navigateByUrl('/pro');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey && event.key === 'k') || 
        (event.metaKey && event.key === 'k') || 
        event.key === '/') {
      event.preventDefault();
      this.toggleSearchModal();
    }
  }

  toggleSearchModal() {
    this.isSearchModalOpen = !this.isSearchModalOpen;
    this.modaleService.toggleSearchModal(this.isSearchModalOpen);
  }

  openSearchPopup() {
    this.isSearchModalOpen = !this.isSearchModalOpen;
    this.modaleService.openSearchModal();
  }

}
