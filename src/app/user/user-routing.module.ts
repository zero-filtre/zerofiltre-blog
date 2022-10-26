import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenExpiredGuard } from '../shared/guard/token-expired.guard';
import { AccountConfirmationPageComponent } from './account-confirmation-page/account-confirmation-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth.guard';
import { StudentCoursesListComponent } from './courses/student-courses-list/student-courses-list.component';
import { TeacherCoursesListComponent } from './courses/teacher-courses-list/teacher-courses-list.component';
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
    canActivate: [TokenExpiredGuard, AuthGuard]
  },
  {
    path: 'profile/edit',
    component: ProfileEntryEditComponent,
    canActivate: [TokenExpiredGuard, AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_USER'
    }
  },
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_ADMIN'
    }
  },
  {
    path: 'dashboard/courses',
    component: StudentCoursesListComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_USER'
    }
  },
  {
    path: 'dashboard/courses/teacher',
    component: TeacherCoursesListComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_USER'
    }
  },
  {
    path: 'dashboard/courses/teacher/all',
    component: TeacherCoursesListComponent,
    canActivate: [TokenExpiredGuard, AuthGuard, HasRoleGuard],
    data: {
      role: 'ROLE_USER'
    }
  },
  {
    path: ':userID',
    component: PublicProfileComponent,
    resolve: {
      user: UserResolver
    },
    canActivate: [TokenExpiredGuard]
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
export class UserRoutingModule { }
