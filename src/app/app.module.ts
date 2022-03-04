import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomePageComponent } from './home-page/home-page.component';
import { MarkdownModule } from 'ngx-markdown';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';

import { httpInterceptorProviders } from './services/http-interceptors';

import { JWT_OPTIONS, JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthService } from './user/auth.service';

registerLocaleData(localeFr, 'fr');

function jwtOptionsFactory(authService: AuthService) {
  return {
    tokenGetter: () => {
      return authService.token
    },
    blacklistedRoutes: [`${environment.apiBaseUrl}/auth`]
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
    SharedModule,
    AppRoutingModule,
    // BrowserTransferStateModule,

    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    })
  ],
  providers: [
    httpInterceptorProviders,
    JwtInterceptor,
    { provide: LOCALE_ID, useValue: "fr-FR" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
