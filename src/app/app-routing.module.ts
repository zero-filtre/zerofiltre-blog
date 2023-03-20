import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RouteGuard } from './shared/guard/route.guard';
import { TokenExpiredGuard } from './shared/guard/token-expired.guard';
import { NotFoundPageComponent } from './shared/not-found-page/not-found-page.component';
import { PaymentFailedComponent } from './shared/payment-failed/payment-failed.component';
import { PaymentSuccessComponent } from './shared/payment-success/payment-success.component';
import { LoggedInAuthGuard } from './user/logged-in-auth.guard';
import { LoginPageComponent } from './user/login-page/login-page.component';
import { PasswordResetPageComponent } from './user/password-reset-page/password-reset-page.component';
import { ResendConfirmationPageComponent } from './user/resend-confirmation-page/resend-confirmation-page.component';
import { SignUpPageComponent } from './user/sign-up-page/sign-up-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'register',
    component: SignUpPageComponent,
    canActivate: [LoggedInAuthGuard],
  }
  ,
  {
    path: 'payment/success',
    component: PaymentSuccessComponent,
    canActivate: [TokenExpiredGuard]
  },
  {
    path: 'payment/cancel',
    component: PaymentFailedComponent,
    canActivate: [TokenExpiredGuard]
  },
  {
    path: 'resetPassword',
    component: PasswordResetPageComponent,
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'resendConfirmation',
    component: ResendConfirmationPageComponent,
    canActivate: [TokenExpiredGuard],
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [TokenExpiredGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'articles',
    loadChildren: () =>
      import('./articles/articles.module').then((m) => m.ArticlesModule),
  },
  {
    path: 'cours',
    loadChildren: () => import('./school/school.module').then((m) => m.SchoolModule),
    canLoad: [RouteGuard]
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    // redirectTo: '/',
  },

  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
