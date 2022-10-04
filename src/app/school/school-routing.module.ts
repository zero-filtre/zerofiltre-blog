import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { lessonComponent } from './lesson/lesson.component';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
