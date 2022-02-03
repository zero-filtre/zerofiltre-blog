import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './home-page/home-page.component';
import { MarkdownModule } from 'ngx-markdown';
import { httpInterceptorProviders } from './services/http-interceptors';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthService } from './user/auth.service';

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
        // allowedDomains: ["example.com"],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    })
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
