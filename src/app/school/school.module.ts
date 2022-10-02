import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';
import { SharedModule } from '../shared/shared.module';
import { CourseDetailPageComponent } from './course-detail-page/course-detail-page.component';
import { CurriculumSidebarComponent } from './curriculum-sidebar/curriculum-sidebar.component';


@NgModule({
  declarations: [
    CourseListPageComponent,
    CourseDetailPageComponent,
    CurriculumSidebarComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule
  ]
})
export class SchoolModule { }
