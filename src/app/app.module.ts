import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './home-page/home-page.component';
import { MarkdownModule } from 'ngx-markdown';
import { httpInterceptorProviders } from './services/http-interceptors';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { AuthInterceptor } from './services/http-interceptors/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';


registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
    SharedModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "fr-FR" },
    AuthInterceptor,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
