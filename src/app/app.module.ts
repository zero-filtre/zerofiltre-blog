import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomePageComponent } from './home-page/home-page.component';
import { MarkdownModule } from 'ngx-markdown';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';

import { httpInterceptorProviders } from './services/http-interceptors';
import { AuthInterceptor } from './services/http-interceptors/auth.interceptor';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateUniversalLoader } from './shared/lang-switcher/translate-universal-loader';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useClass: TranslateUniversalLoader
      }
    })
  ],
  providers: [
    httpInterceptorProviders,
    AuthInterceptor,
    { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
