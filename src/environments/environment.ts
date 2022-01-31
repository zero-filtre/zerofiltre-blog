// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost',
  blogUrl: 'https://blog-dev.zerofiltre.tech',
  GITHUB_CLIENT_ID: '9b6bffa9841d19dfd8aa',
  STACK_OVERFLOW_CLIENT_ID: '22742',
  gitHubRedirectURL: 'http://localhost:4200/user/auth/github',
  stackOverflowRedirectURL: 'http://localhost:4200/user/auth/stackOverflow',
  username: 'localUser',
  envName: 'local'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
