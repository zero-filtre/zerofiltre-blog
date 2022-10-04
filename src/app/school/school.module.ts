import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';
import { SharedModule } from '../shared/shared.module';
import { CourseDetailPageComponent } from './course-detail-page/course-detail-page.component';
import { CurriculumComponent } from './curriculum/curriculum.component';


@NgModule({
  declarations: [
    CourseListPageComponent,
    CourseDetailPageComponent,
    CurriculumComponent,
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule
  ]
})
export class SchoolModule { }
