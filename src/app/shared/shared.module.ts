import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppShellRenderDirective } from '../directives/app-shell-render.directive';
import { AppShellNoRenderDirective } from '../directives/app-shell-no-render.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MarkdownModule } from 'ngx-markdown';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateUniversalLoader } from './lang-switcher/translate-universal-loader';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ImageComponent } from './image/image.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { BaseArticleListComponent } from './base-article-list/base-article-list.component';
import { VimeoUrlPipe } from './pipes/vimeo-url.pipe';
import { TextEditorComponent } from './ui/text-editor/text-editor.component';
import { AutoSaveButtonComponent } from './ui/buttons/auto-save-button/auto-save-button.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { UrlPipe } from './pipes/url.pipe';

const components = [
  AppShellRenderDirective,
  AppShellNoRenderDirective,
  FooterComponent,
  ImageComponent,
  HeaderComponent,
  BaseArticleListComponent,
  TextEditorComponent,
  AutoSaveButtonComponent,
  NotFoundPageComponent,
  VimeoUrlPipe,
  UrlPipe,
  UploadFormComponent
];

const modules = [
  CommonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatSnackBarModule,
  MatDialogModule,
  MatIconModule,
  RouterModule,
  HttpClientModule,
  NgxSkeletonLoaderModule,
  FormsModule,
  ReactiveFormsModule,
  InfiniteScrollModule,
  TranslateModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSlideToggleModule
];

@NgModule({
  declarations: [...components],
  imports: [
    ...modules,
    MarkdownModule.forRoot(),

    ImagekitioAngularModule.forRoot({
      publicKey: 'public_TOa/IP2yX1o2eHip4nsS+rPLsjE=', // or environment.imagekitPublicKey
      urlEndpoint: 'https://ik.imagekit.io/lfegvix1p', // or environment.imagekitUrlEndpoint
      authenticationEndpoint: '' // or environment.bucketAuthenticationEndpoint
    }),

    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useClass: TranslateUniversalLoader
      }
    })
  ],
  exports: [
    ...components,
    ...modules,
  ]
})
export class SharedModule { }
