import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';
import { SharedModule } from '../shared/shared.module';
import { CourseContentComponent } from './course-content/course-content.component';
import { CurriculumSidebarComponent } from './curriculum-sidebar/curriculum-sidebar.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    CourseListPageComponent,
    CourseContentComponent,
    CurriculumSidebarComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class SchoolModule { }
