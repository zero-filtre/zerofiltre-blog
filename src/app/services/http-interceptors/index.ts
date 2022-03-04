/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { RefreshTokenInterceptor } from './refresh-token.interceptor';

import { JwtInterceptor } from '@auth0/angular-jwt';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
];