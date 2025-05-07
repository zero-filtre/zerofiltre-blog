import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenExpiredGuard } from '../shared/guard/token-expired.guard';
import { CompanyCoursesComponent } from '../shared/company-courses/company-courses.component';
import { AuthGuard } from '../user/auth.guard';
import { HasRoleGuard } from '../user/has-role.guard';
import { CompaniesComponent } from './features/companies/companies.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoggedInAuthGuard } from '../user/logged-in-auth.guard';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_ADMIN',
    },
  },
  {
    path: 'companies',
    component: CompaniesComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_ADMIN',
    },
  },
  {
    path: 'companies/:companyId/courses',
    component: CompanyCoursesComponent,
    canActivate: [TokenExpiredGuard, AuthGuard],
    data: {
      role: 'ROLE_ADMIN',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    LoggedInAuthGuard
  ]
})
export class AdminRoutingModule { }
