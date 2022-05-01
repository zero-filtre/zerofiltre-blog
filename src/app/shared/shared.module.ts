import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDialogModule } from '@angular/material/dialog'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppShellRenderDirective } from '../directives/app-shell-render.directive';
import { AppShellNoRenderDirective } from '../directives/app-shell-no-render.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

const components = [
  AppShellRenderDirective,
  AppShellNoRenderDirective,
  FooterComponent
];

const modules = [
  CommonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatSnackBarModule,
  MatDialogModule,
  RouterModule,
  HttpClientModule,
  NgxSkeletonLoaderModule,
  FormsModule,
  ReactiveFormsModule,
  InfiniteScrollModule,
  TranslateModule,

  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [
    ...components,
    ...modules,
  ]
})
export class SharedModule { }
