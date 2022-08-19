import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolCoursesRoutingModule } from './school-courses-routing.module';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { SharedModule } from '../shared/shared.module';

import { VimeModule } from '@vime/angular';
import { MarkdownModule } from 'ngx-markdown';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
  
    CourseDetailComponent
  ],
  imports: [
    CommonModule,
    SchoolCoursesRoutingModule,
    VimeModule,
    SharedModule,
    MarkdownModule.forChild(),
    PdfViewerModule
  ]
})
export class SchoolCoursesModule { }
