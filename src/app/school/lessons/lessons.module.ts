import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonsRoutingModule } from './lessons-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LessonsRoutingModule,
    SharedModule
  ]
})
export class LessonsModule { }
