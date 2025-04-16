import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseEnrollmentResolver } from '../course-enrollment.resolver';
import { CourseDetailPageComponent } from './course-detail-page/course-detail-page.component';
import { CourseEditPageComponent } from './course-edit-page/course-edit-page.component';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';
import { TokenExpiredGuard } from 'src/app/shared/guard/token-expired.guard';
import { AuthGuard } from 'src/app/user/auth.guard';
import { CourseAccessGuardGuard } from './course-access-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: CourseListPageComponent,
  },
  {
    path: ':course_id',
    component: CourseDetailPageComponent,
    // canActivate: [CourseAccessGuardGuard],

    // resolve: {
    //   sub: CourseEnrollmentResolver
    // },
  },
  {
    path: ':course_id/edit',
    component: CourseEditPageComponent,
    canActivate: [TokenExpiredGuard, AuthGuard],
    // canActivate: [TokenExpiredGuard, AuthGuard, CourseAccessGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
