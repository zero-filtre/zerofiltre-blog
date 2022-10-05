import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { lessonComponent } from './lesson/lesson.component';

import { CourseDetailPageComponent } from './course-detail-page/course-detail-page.component';
import { CourseEditPageComponent } from './course-edit-page/course-edit-page.component';

import { CourseListPageComponent } from './course-list-page/course-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: CourseListPageComponent,
  },
  {
    path: ':lesson_id',
    component: lessonComponent,
  },
  {
    path: ':course_id/presentation',
    component: CourseDetailPageComponent
  },
  {
    path: ':course_id/edit',
    component: CourseEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
