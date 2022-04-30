import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, Observable, shareReplay } from 'rxjs';
import { FileUploadService } from './services/file-upload.service';
import { MessageService } from './services/message.service';
import { AddTargetToExternalLinks } from './services/utilities.service';
import { AuthService } from './user/auth.service';

declare var Prism: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @HostListener('click', ['$event']) onClick(event: any) {
    this.logCopySuccessMessage(event);
  }

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  public userBrowserLanguage!: string;
  public MY_ACCOUNT = 'Mon compte';
  public MY_ARTICLES = 'Mes articles';
  public ALL_ARTICLES = 'Tous nos articles';

  public activePage = this.MY_ACCOUNT;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
    private messageService: MessageService,
    private router: Router,
    public authService: AuthService,
    private fileUploadService: FileUploadService
  ) {
    this.setBrowserTranslationConfigs();

    router.events.pipe(filter(event => event instanceof NavigationStart))
      .subscribe(({ url }: any) => {
        if (url === '/user/profile') this.activePage = this.MY_ACCOUNT;
        if (url === '/user/dashboard') this.activePage = this.MY_ARTICLES;
        if (url === '/user/dashboard/admin') this.activePage = this.ALL_ARTICLES;
      });
  }

  public checkRouteUrl(): boolean {
    const componentsPrefix = [
      '/user/profile',
      '/user/profile/edit',
      '/user/dashboard',
    ];
    const currentUrl = this.router.url;
    return componentsPrefix.some((route: string) => currentUrl.includes(route));
  }

  public setBrowserTranslationConfigs() {
    if (isPlatformBrowser(this.platformId)) {
      this.userBrowserLanguage = (window.navigator as any).language;
    }

    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  // Use to set the language on a btn click for example
  public useLanguage(language: string) {
    this.translate.use(language);
  }

  public seeMyInfos() {
    this.activePage = this.MY_ACCOUNT;
  }

  public fetchAllArticlesAsAdmin() {
    this.activePage = this.ALL_ARTICLES;
  }

  public fetchAllArticlesAsUser() {
    this.activePage = this.MY_ARTICLES;
  }

  public logCopySuccessMessage(event: any) {
    if (
      event.target.innerText === 'Copy' ||
      event.target.className === 'copy-to-clipboard-button' ||
      event.target.parentElement.className === 'copy-to-clipboard-button'
    ) {
      this.messageService.codeCopied();
    }
  }

  public loadCopyToClipboardSvg() {
    Prism.plugins.toolbar.registerButton('copy-code', function (_env: any) {
      const svgButton = document.createElement('button');
      svgButton.classList.add('copy-to-clipboard-svg');

      svgButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 lg:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    `;

      return svgButton;
    });
  }

  ngOnInit(): void {
    this.activePage = this.MY_ACCOUNT;

    if (isPlatformBrowser(this.platformId)) {
      this.loadCopyToClipboardSvg();
      (window as any).onload = AddTargetToExternalLinks();
    }

    if (isPlatformServer(this.platformId)) {
      this.fileUploadService.xToken$.subscribe();
    }
  }
}
