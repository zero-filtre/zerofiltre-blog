import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountConfirmationPageComponent } from './account-confirmation-page/account-confirmation-page.component';
import { PasswordRenewalPageComponent } from './password-renewal-page/password-renewal-page.component';
import { SocialAuthComponent } from './social-auth/social-auth.component';

const routes: Routes = [
  // { path: ':id', component: ProfileComponent }
  { path: 'passwordReset', component: PasswordRenewalPageComponent },
  { path: 'accountConfirmation', component: AccountConfirmationPageComponent },
  { path: 'social-auth', component: SocialAuthComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
