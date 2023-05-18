import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseEnrollmentResolver } from '../course-enrollment.resolver';
import { LessonAccessGuard } from './lesson-access.guard';
import { LessonEditPageComponent } from './lesson-edit-page/lesson-edit-page.component';
import { LessonComponent } from './lesson/lesson.component';
import { TokenExpiredGuard } from 'src/app/shared/guard/token-expired.guard';
import { AuthGuard } from 'src/app/user/auth.guard';

const routes: Routes = [
  {
    path: ':lesson_id',
    component: LessonComponent,
    canActivate: [LessonAccessGuard],
    resolve: {
      sub: CourseEnrollmentResolver
    },
  },
  {
    path: ':lesson_id/edit',
    component: LessonEditPageComponent,
    canActivate: [TokenExpiredGuard, AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessonsRoutingModule { }
