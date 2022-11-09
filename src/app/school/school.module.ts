import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { CourseListPageComponent } from './courses/course-list-page/course-list-page.component';
import { SharedModule } from '../shared/shared.module';
import { LessonComponent } from './lessons/lesson/lesson.component';
import { CurriculumSidebarComponent } from './curriculums/curriculum-sidebar/curriculum-sidebar.component';
import { MarkdownModule } from 'ngx-markdown';

import { CourseDetailPageComponent } from './courses/course-detail-page/course-detail-page.component';
import { CurriculumComponent } from './curriculums/curriculum/curriculum.component';

import { CourseInitPopupComponent } from './courses/course-init-popup/course-init-popup.component';
import { CourseDeletePopupComponent } from './courses/course-delete-popup/course-delete-popup.component';
import { CourseEditPageComponent } from './courses/course-edit-page/course-edit-page.component';
import { ChapterInitPopupComponent } from './chapters/chapter-init-popup/chapter-init-popup.component';
import { ChapterDeletePopupComponent } from './chapters/chapter-delete-popup/chapter-delete-popup.component';
import { LessonDeletePopupComponent } from './lessons/lesson-delete-popup/lesson-delete-popup.component';
import { LessonInitPopupComponent } from './lessons/lesson-init-popup/lesson-init-popup.component';
import { LessonEditPageComponent } from './lessons/lesson-edit-page/lesson-edit-page.component';
import { ChapterUpdatePopupComponent } from './chapters/chapter-update-popup/chapter-update-popup.component';


@NgModule({
  declarations: [
    CurriculumComponent,
    CurriculumSidebarComponent,
    CourseDetailPageComponent,
    CourseListPageComponent,
    CourseInitPopupComponent,
    CourseDeletePopupComponent,
    CourseEditPageComponent,
    ChapterInitPopupComponent,
    ChapterDeletePopupComponent,
    ChapterUpdatePopupComponent,
    LessonComponent,
    LessonDeletePopupComponent,
    LessonInitPopupComponent,
    LessonEditPageComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class SchoolModule { }
