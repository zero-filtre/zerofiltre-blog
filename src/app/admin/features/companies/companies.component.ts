import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Company } from '../../features/companies/company.model';
import { CompanyService } from '../../features/companies/company.service';
import { LoadEnvService } from '../../../services/load-env.service';
import { SeoService } from '../../../services/seo.service';
import { BaseCompanyListComponent } from '../../core/base-company-list/base-company-list.component';
import { JsonLdService } from 'ngx-seo';
import { AuthService } from '../../../user/auth.service';
import { CompanyCreatePopupComponent } from './company-create-popup/company-create-popup.component';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent
  extends BaseCompanyListComponent
  implements OnInit, OnDestroy
{
  companies$: Subscription;
  companies: Company[] = [];
  pageSize: number = 5;

  PUBLISHED = 'published';

  activePage: string = this.PUBLISHED;
  mainPage = true;

  constructor(
    public loadEnvService: LoadEnvService,
    public seo: SeoService,
    public jsonLd: JsonLdService,
    public router: Router,
    public route: ActivatedRoute,
    public companyService: CompanyService,
    public authService: AuthService,
    public translate: TranslateService,
    public dialogEntryRef: MatDialog,
    public dialogDeleteRef: MatDialog,
    public messageService: MessageService,
    @Inject(PLATFORM_ID) public platformId: any
  ) {
    super(
      loadEnvService,
      seo,
      jsonLd,
      router,
      route,
      companyService,
      authService,
      translate,
      dialogEntryRef,
      dialogDeleteRef
    );
  }

  openCompanyEntryDialog(): void {
    this.dialogEntryRef
      .open(CompanyCreatePopupComponent, {
        width: '850px',
        height: '350px',
        panelClass: 'article-popup-panel',
      })
      .afterClosed()
      .subscribe((company: Company) => {
        if (company) {
          this.fetchAllCompanies();
          this.messageService.openSnackBarSuccess(
            'Entreprise créée avec succès !',
            'OK'
          );
        }
      });
  }

  sortByTab(tab: string): void {
    this.companies = [];

    if (tab === this.PUBLISHED) {
      this.activePage = this.PUBLISHED;
      this.router.navigateByUrl('/admin/companies');
    }

    this.scrollyPageNumber = 0;
    this.notEmptyCompanies = true;
  }

  fetchAllCompanies() {
    this.loading = true;
    this.subscription$ = this.companyService
      .getCompanies(this.pageNumber, this.pageItemsLimit)
      .subscribe(this.handleFetchedCompanies);
  }

  fetchMoreCompanies(): any {
    this.scrollyPageNumber += 1;

    this.companyService
      .getCompanies(this.scrollyPageNumber, this.pageItemsLimit)
      .subscribe((response: any) => this.handleFetchNewCompanies(response));
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParamMap.subscribe((query) => {
        this.status = query.get('filter')!;
        if (!this.status) {
          this.activePage = this.PUBLISHED;
          return this.fetchAllCompanies();
        }

        this.activePage = this.PUBLISHED;
        this.fetchAllCompanies();
      });
    }

    this.seo.generateTags({
      title: this.translate.instant('meta.coursesTitle'),
      description: this.translate.instant('meta.coursesDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png',
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription$.unsubscribe();
    }
  }
}
