import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './home-page/home-page.component';
import { MarkdownModule } from 'ngx-markdown';
import { httpInterceptorProviders } from './services/http-interceptors';
import { JwtInterceptor, JwtModule } from "@auth0/angular-jwt";
import { AuthService } from './user/auth.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';


registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: AuthService.token,
        disallowedRoutes: [`${environment.apiBaseUrl}/auth`, `${environment.apiBaseUrl}/user`],
        // allowedDomains: ["example.com"],
      },
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "fr-FR" },
    JwtInterceptor,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
