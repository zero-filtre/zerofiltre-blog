import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountConfirmationPageComponent } from './account-confirmation-page/account-confirmation-page.component';
import { AuthGuard } from './auth.guard';
import { LoggedInAuthGuard } from './logged-in-auth.guard';
import { PasswordRenewalPageComponent } from './password-renewal-page/password-renewal-page.component';
import { SocialAuthComponent } from './social-auth/social-auth.component';

const routes: Routes = [
  // { path: ':id', component: ProfileComponent }
  { path: 'passwordReset', component: PasswordRenewalPageComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'accountConfirmation', component: AccountConfirmationPageComponent },
  { path: 'social-auth', component: SocialAuthComponent, canActivate: [LoggedInAuthGuard] }
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
