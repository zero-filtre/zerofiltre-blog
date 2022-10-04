import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { CourseListPageComponent } from './course-list-page/course-list-page.component';
import { SharedModule } from '../shared/shared.module';
import { CourseInitPopupComponent } from './course-init-popup/course-init-popup.component';
import { CourseDeletePopupComponent } from './course-delete-popup/course-delete-popup.component';
import { CourseEditPageComponent } from './course-edit-page/course-edit-page.component';


@NgModule({
  declarations: [
    CourseListPageComponent,
    CourseInitPopupComponent,
    CourseDeletePopupComponent,
    CourseEditPageComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule
  ]
})
export class SchoolModule { }
