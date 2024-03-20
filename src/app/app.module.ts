import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomePageComponent } from './home-page/home-page.component';
import { WachatgptHomePageComponent } from './wachatgpt-home-page/wachatgpt-home-page.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { httpInterceptorProviders } from './services/http-interceptors';
import { AuthInterceptor } from './services/http-interceptors/auth.interceptor';
import { JsonLdService } from 'ngx-seo';
import { SlugUrlPipe } from './shared/pipes/slug-url.pipe';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    WachatgptHomePageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    JsonLdService,
    SlugUrlPipe,
    httpInterceptorProviders,
    AuthInterceptor,
    { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }