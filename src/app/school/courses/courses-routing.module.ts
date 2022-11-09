import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailPageComponent } from './course-detail-page/course-detail-page.component';
import { CourseEditPageComponent } from './course-edit-page/course-edit-page.component';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: CourseListPageComponent,
  },
  {
    path: ':course_id',
    component: CourseDetailPageComponent,
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
export class CoursesRoutingModule { }
