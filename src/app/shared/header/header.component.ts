import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { ModalService } from 'src/app/services/modal.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { environment } from 'src/environments/environment';
import { SearchPopupComponent } from '../search-popup/search-popup.component';

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

  bannerText = "Bootcamp | 'Mettez enfin en place le Domain Driven Design'  | les inscriptions sont enfin ouvertes ! "
  isBannerVisible = true;
  isSearchModalOpen = false

  constructor(
    private loadEnvService: LoadEnvService,
    public authService: AuthService,
    private router: Router,
    public seo: SeoService,
    private modaleService: ModalService
  ) { }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  subscribeToPro() {
    this.router.navigateByUrl('/pro');
  }

  ngOnInit(): void {
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
