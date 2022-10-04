import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';
import { SharedModule } from '../shared/shared.module';
import { lessonComponent } from './lesson/lesson.component';
import { CurriculumSidebarComponent } from './curriculum-sidebar/curriculum-sidebar.component';
import { MarkdownModule } from 'ngx-markdown';

import { CourseDetailPageComponent } from './course-detail-page/course-detail-page.component';
import { CurriculumComponent } from './curriculum/curriculum.component';

import { CourseInitPopupComponent } from './course-init-popup/course-init-popup.component';
import { CourseDeletePopupComponent } from './course-delete-popup/course-delete-popup.component';
import { CourseEditPageComponent } from './course-edit-page/course-edit-page.component';


@NgModule({
  declarations: [
    CourseListPageComponent,
    lessonComponent,
    CurriculumSidebarComponent
    CourseDetailPageComponent,
    CurriculumComponent,
    CourseInitPopupComponent,
    CourseDeletePopupComponent,
    CourseEditPageComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class SchoolModule { }
