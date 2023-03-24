import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseSubscriptionResolver } from './course-subscription.resolver';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: ':course_id',
    loadChildren: () => import('./lessons/lessons.module').then((m) => m.LessonsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
