import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonEditPageComponent } from '../lesson-edit-page/lesson-edit-page.component';
import { LessonComponent } from '../lesson/lesson.component';

const routes: Routes = [
  {
    path: ':lesson_id',
    component: LessonComponent
  },
  {
    path: ':lesson_id/edit',
    component: LessonEditPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessonsRoutingModule { }
