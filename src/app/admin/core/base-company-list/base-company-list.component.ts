import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JsonLdService } from 'ngx-seo';
import { Subscription } from 'rxjs';
import { LoadEnvService } from '../../../services/load-env.service';
import { SeoService } from '../../../services/seo.service';
import { slugify } from '../../../services/utilities.service';
import { AuthService } from '../../../user/auth.service';
import { environment } from '../../../../environments/environment';
import { CompanyService } from '../../features/companies/company.service';
import { Company } from '../../features/companies/company.model';
import { User } from '../../../user/user.model';

@Component({
  selector: 'app-base-company-list',
  templateUrl: './base-company-list.component.html',
  styleUrls: ['./base-company-list.component.css']
})
export class BaseCompanyListComponent {

  readonly blogUrl = environment.blogUrl;

  prod = this.blogUrl.startsWith('https://dev.') ? false : true;
  siteUrl = this.prod ? "https://zerofiltre.tech" : "https://dev.zerofiltre.tech"

  companies: Company[];

  PUBLISHED = 'published';

  notEmptyCompanies = true;
  noCompanyAvailable: boolean = false;

  notScrolly = true;
  lastPage: number;
  hasNext!: boolean;
  scrollyPageNumber = 0;

  pageNumber: number = 0;
  pageItemsLimit: number = 6;

  loadingMore = false;
  loading = false;

  errorMessage = '';

  activePage: string = this.PUBLISHED;
  mainPage = true;

  subscription$!: Subscription;
  status!: string;

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
  ) { }

  get canCreateCompany() {
    const user = this.authService?.currentUsr as User
    return this.companyService.canCreateCompany(user);
  }
  canAccessCompany(company: Company) {
    const user = this.authService?.currentUsr as User
    // return this.companyService.canAccessCompany(user, company);
  }
  canEditCompany(company: Company) {
    const user = this.authService?.currentUsr as User
    // return this.companyService.canEditCompany(user, company);
  }

  onScroll() {
    if (this.notScrolly && this.notEmptyCompanies && this.hasNext) {
      this.loadingMore = true;
      this.notScrolly = false;
      this.fetchMoreCompanies();
    }
  }

  fetchMoreCompanies(): any {
    // do nothing
  }

  handleFetchNewCompanies({ content, hasNext }: any) {
    const newCompanies = [...content];
    this.loadingMore = false;
    this.hasNext = hasNext;

    if (newCompanies.length === 0) {
      this.notEmptyCompanies = false;
    }

    this.companies = this.companies.concat(newCompanies);
    this.notScrolly = true;
  }

  handleFetchedCompanies = {
    next: ({ content, hasNext }: any) => {
      this.companies = content;
      this.loading = false;
      this.hasNext = hasNext;
      this.noCompanyAvailable = false;

      if (this.companies.length === 0) {
        this.errorMessage = 'Aucune organisation trouvée 😊!';
        this.noCompanyAvailable = true;
      }
    },
    error: (_error: HttpErrorResponse) => {
      this.loading = false;
      this.hasNext = false;
      this.companies = [];
      this.errorMessage = "Oops... une erreur s'est produite!";
    },
  };

  openCompanyEntryDialog(): void {
    // this.dialogEntryRef.open(CompanyInitPopupComponent, {
    //   width: '850px',
    //   height: '350px',
    //   panelClass: 'article-popup-panel',
    //   data: {
    //     history: this.router.url
    //   }
    // });
  }

  openCompanyDeleteDialog(courseId: any): void {
    // this.dialogDeleteRef.open(CompanyDeletePopupComponent, {
    //   panelClass: 'delete-article-popup-panel',
    //   data: {
    //     courseId,
    //     history: this.router.url
    //   }
    // });
  }

  ngOnInit(): void {
    // do nothing
  }

}
