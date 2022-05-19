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
import { ImageComponent } from './image/image.component';
import { ImagekitioAngularModule } from 'imagekitio-angular';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MarkdownModule } from 'ngx-markdown';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateUniversalLoader } from './lang-switcher/translate-universal-loader';
import { HeaderComponent } from './header/header.component';

const components = [
  AppShellRenderDirective,
  AppShellNoRenderDirective,
  FooterComponent,
  ImageComponent,
  HeaderComponent
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
  MatProgressBarModule
];

@NgModule({
  declarations: [...components, HeaderComponent],
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
