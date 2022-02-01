import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './user/auth.guard';
import { LoginPageComponent } from './user/login-page/login-page.component';
import { PasswordResetPageComponent } from './user/password-reset-page/password-reset-page.component';
import { SignUpPageComponent } from './user/sign-up-page/sign-up-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: SignUpPageComponent
  },
  {
    path: 'resetPassword',
    component: PasswordResetPageComponent
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    // canActivate: [AuthGuard]
  },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'articles',
    loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'articles',
  },
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
