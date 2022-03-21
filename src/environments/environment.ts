// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'https://blog-api-dev.zerofiltre.tech',
  blogUrl: 'https://blog-dev.zerofiltre.tech',
  ovhServerUrl: 'https://storage.gra.cloud.ovh.net/v1/AUTH_5159edadfde2413fb43128c1fef06fbf/zerofiltre-object-container',
  ovhTokenUrl: 'https://auth.cloud.ovh.net/v3/auth/tokens?nocatalog',
  GITHUB_CLIENT_ID: '9b6bffa9841d19dfd8aa',
  STACK_OVERFLOW_CLIENT_ID: '22742',
  gitHubRedirectURL: 'https://blog-dev.zerofiltre.tech/user/social-auth',
  stackOverflowRedirectURL: 'https://blog-dev.zerofiltre.tech/user/social-auth',
  ovhAuthPassword: '', //Remove before github push
  ovhAuthName: 'user-kBB6rJAw6Vgt',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
