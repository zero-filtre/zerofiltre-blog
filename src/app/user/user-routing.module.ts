import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountConfirmationPageComponent } from './account-confirmation-page/account-confirmation-page.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoggedInAuthGuard } from './logged-in-auth.guard';
import { PasswordRenewalPageComponent } from './password-renewal-page/password-renewal-page.component';
import { ProfileEntryEditComponent } from './profile-entry-edit/profile-entry-edit.component';
import { ProfileComponent } from './profile/profile.component';
import { SocialAuthComponent } from './social-auth/social-auth.component';

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
    path: 'profile/edit',
    component: ProfileEntryEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
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
