import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';


@NgModule({
  declarations: [
    CourseListPageComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule
  ]
})
export class SchoolModule { }
