import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompaniesComponent } from './features/companies/companies.component';
import { SharedModule } from '../shared/shared.module';
import { BaseCompanyListComponent } from './core/base-company-list/base-company-list.component';
import { CompanyCreatePopupComponent } from './features/companies/company-create-popup/company-create-popup.component';
import { CompanyDeletePopupComponent } from './features/companies/company-delete-popup/company-delete-popup.component';
import { CompanySearchPopupComponent } from './features/companies/company-search-popup/company-search-popup.component';
import { StatCardComponent } from './dashboard/stat-card/stat-card.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CompaniesComponent,
    BaseCompanyListComponent,
    CompanyCreatePopupComponent,
    CompanyDeletePopupComponent,
    CompanySearchPopupComponent,
    StatCardComponent,
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule],
})
export class AdminModule {}
