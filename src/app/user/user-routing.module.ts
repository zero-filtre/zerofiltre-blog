import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordRenewalPageComponent } from './password-renewal-page/password-renewal-page.component';

const routes: Routes = [
  // { path: ':id', component: ProfileComponent }
  { path: 'passwordReset', component: PasswordRenewalPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
