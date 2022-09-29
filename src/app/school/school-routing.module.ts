import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailPageComponent } from './course-detail-page/course-detail-page.component';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: CourseListPageComponent,
  },
  {
    path: ':id',
    component: CourseDetailPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
