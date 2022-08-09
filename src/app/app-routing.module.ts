import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './shared/not-found-page/not-found-page.component';
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
  },
  {
    path: 'resetPassword',
    component: PasswordResetPageComponent,
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'resendConfirmation',
    component: ResendConfirmationPageComponent,
  },
  {
    path: '',
    component: HomePageComponent,
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
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then((m) => m.CoursesModule),
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
