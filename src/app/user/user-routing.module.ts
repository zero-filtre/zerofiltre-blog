import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountConfirmationPageComponent } from './account-confirmation-page/account-confirmation-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HasRoleGuard } from './has-role.guard';
import { LoggedInAuthGuard } from './logged-in-auth.guard';
import { PasswordRenewalPageComponent } from './password-renewal-page/password-renewal-page.component';
import { ProfileEntryEditComponent } from './profile-entry-edit/profile-entry-edit.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { SocialAuthComponent } from './social-auth/social-auth.component';
import { UserResolver } from './user.resolver';

const routes: Routes = [
  { path: 'passwordReset', component: PasswordRenewalPageComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'accountConfirmation', component: AccountConfirmationPageComponent },
  { path: 'social-auth', component: SocialAuthComponent, canActivate: [LoggedInAuthGuard] },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':userID',
    component: PublicProfileComponent,
    resolve: {
      user: UserResolver
    },
  },
  {
    path: 'profile/:userID/edit',
    component: ProfileEntryEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_USER'
    }
  },
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_ADMIN'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    LoggedInAuthGuard
  ]
})
export class UserRoutingModule { }
