import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { map, Observable, shareReplay, filter } from 'rxjs';
import { FileUploadService } from './services/file-upload.service';
import { MessageService } from './services/message.service';
import { ModalService } from './services/modal.service';
import { AddTargetToExternalLinks } from './services/utilities.service';
import { AuthService } from './user/auth.service';

import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';

import { LoadEnvService } from './services/load-env.service';
import { environment } from 'src/environments/environment';
import { GeoLocationService } from './services/geolocaton.service';
import { TipsService } from './services/tips.service';

declare let Prism: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  readonly servicesUrl = environment.servicesUrl;
  readonly coursesUrl = environment.coursesUrl;
  readonly blogUrl = environment.blogUrl;
  readonly activeCourseModule = environment.courseRoutesActive === 'true';

  appLogoUrl =
    'https://ik.imagekit.io/lfegvix1p/logoblue_XmLzzzq19.svg?updatedAt=1681556349203';

  prod = !this.blogUrl.startsWith('https://dev.');

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  userBrowserLanguage!: string;
  MY_ACCOUNT = 'Mon compte';
  MY_ARTICLES = 'Mes articles';
  ALL_ARTICLES = 'Tous nos articles';
  ADMIN_SPACE = 'Espace administrateur';
  ALL_COMPANIES = 'Toutes les organisations';
  DASHBOARD = 'Tableau de bord';
  MY_COURSES = 'Mes cours';
  MY_TRAININGS = 'Mes formations';
  ALL_TRAININGS = 'Toutes nos formations';

  changingRoute: boolean;

  activePage = '';

  envValue!: any;

  loading: boolean = true;

  constructor(
    private loadEnvService: LoadEnvService,
    @Inject(PLATFORM_ID) private platformId: any,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
    private messageService: MessageService,
    private router: Router,
    public authService: AuthService,
    private fileUploadService: FileUploadService,
    private modalService: ModalService,
    public geoLocationService: GeoLocationService,
    private tipsService: TipsService
  ) {
    this.setBrowserTranslationConfigs();
  }

  checkRouteChange(routerEvent: RouterEvent) {
    if (routerEvent instanceof NavigationStart) {
      this.changingRoute = true;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      setTimeout(() => {
        this.changingRoute = false;
      }, 1000);
    }
  }

  isSidenavOpenedByDefault(): boolean {
    const componentsPrefix = [
      '/admin',
      '/user/profile',
      '/user/profile/edit',
      '/user/dashboard',
    ];
    const currentUrl = this.router.url;
    return componentsPrefix.some((route: string) => currentUrl.includes(route));
  }

  setBrowserTranslationConfigs() {
    if (isPlatformBrowser(this.platformId)) {
      this.userBrowserLanguage = (window.navigator as any).language;
    }

    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  // Use to set the language on a btn click for example
  useLanguage(language: string) {
    this.translate.use(language);
  }

  seeMyInfos() {
    this.activePage = this.MY_ACCOUNT;
  }

  fetchAllArticlesAsAdmin() {
    this.activePage = this.ALL_ARTICLES;
  }

  fetchAllArticlesAsUser() {
    this.activePage = this.MY_ARTICLES;
  }

  fetchAllCoursesAsUser() {
    this.activePage = this.MY_COURSES;
  }

  fetchAllCoursesAsTeacher() {
    this.activePage = this.MY_TRAININGS;
  }

  fetchAllCoursesAsAdmin() {
    this.activePage = this.ALL_TRAININGS;
  }

  setCopyToClipboardEventMessage() {
    const buttons = document.querySelectorAll('.copy-to-clipboard-button');
  
    buttons.forEach((btn) => {
      if (!(btn as any)._listenerAttached) {
        btn.addEventListener('click', () => this.messageService.codeCopied());
        (btn as any)._listenerAttached = true;
      }
    });
  }

  loadCopyToClipboardSvg() {
    Prism.plugins.toolbar.registerButton('copy-code', function (_env: any) {
      const svgButton = document.createElement('button');
      svgButton.classList.add('copy-to-clipboard-svg');
      svgButton.ariaLabel = 'Copy to clipboard button';

      svgButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" aria-label="Copy to clipboard button" class="w-5 lg:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      `;

      return svgButton;
    });
  }

  setActiveLinkFromActiveRoute(url: string) {
    if (url?.startsWith('/admin')) this.activePage = this.ADMIN_SPACE;
    if (url?.startsWith('/user/profile')) this.activePage = this.MY_ACCOUNT;
    if (url?.startsWith('/user/dashboard')) this.activePage = this.MY_ARTICLES;
    if (url?.startsWith('/user/dashboard/admin'))
      this.activePage = this.ALL_ARTICLES;
    if (url?.startsWith('/user/dashboard/courses'))
      this.activePage = this.MY_COURSES;
    if (url?.startsWith('/user/dashboard/teacher/courses'))
      this.activePage = this.MY_TRAININGS;
    if (url?.startsWith('/user/dashboard/courses/all'))
      this.activePage = this.ALL_TRAININGS;
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter((event): event is RouterEvent => event instanceof RouterEvent)
      )
      .subscribe((e) => {
        setTimeout(() => this.checkRouteChange(e), 0);
      });
  
    if (isPlatformBrowser(this.platformId)) {
      const observer = new MutationObserver(() => {
        this.setCopyToClipboardEventMessage();
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  subscribedCourses$: Observable<any[]>;

  subscribeToPro() {
    this.router.navigateByUrl('/pro');
  }

  showTip() {
    const lastShownDate = localStorage.getItem('lastTipDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastShownDate !== today) {
      this.tipsService.getTipOfTheDay().subscribe({
        next: (response: string) => {
          this.modalService.openTipsModal(response);
        },
        error: (error) => {
          console.error('Error fetching tip of the day:', error);
        },
      });
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe(({ url }: any) => {
      this.setActiveLinkFromActiveRoute(url);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.showTip();
      this.loadCopyToClipboardSvg();
      (window as any).onload = AddTargetToExternalLinks();
    }

    if (isPlatformBrowser(this.platformId) && this.authService.currentUsr) {
      this.fileUploadService.xToken$.subscribe();
      this.modalService.checkUserEmail(this.authService.currentUsr);
    }
  }
}
