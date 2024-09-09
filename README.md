# zerofiltreBlog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.

## Setup and Install dependencies

Make sure you have the angular CLI installed
  1. Check version
  `ng -v`
  2. Installation (If not yet installed)
  `npm install -g @angular/cli@15`

Run the following in a terminal to get started

```
git clone https://github.com/zero-filtre/zerofiltre-blog.git
cd zerofiltre-blog
npm install --force
```

## Run Development server

Create a file `environment.locals.ts` in `/src/environments/` and add your local variables inside.

```ts
export const environment = {
  production: false,
  apiBaseUrl: "https://blog-api-dev.zerofiltre.tech",
  blogUrl: "https://blog-dev.zerofiltre.tech",
  ovhServerUrl:
    "https://storage.gra.cloud.ovh.net/v1/AUTH_5159edadfde2413fb43128c1fef06fbf/zerofiltre-object-container",
  ovhTokenUrl: "https://auth.cloud.ovh.net/v3/auth/tokens?nocatalog",
  GITHUB_CLIENT_ID: "",
  STACK_OVERFLOW_CLIENT_ID: "",
  gitHubRedirectURL: "",
  stackOverflowRedirectURL: "",
  ovhAuthName: "",
  courseRoutesActive:'true',
  servicesUrl: '',
  vimeoToken: '',
  vimeoClientSecret: '',
  schoolApi: '',
  coursesUrl: '',
  stripePublicKey: '',
  vimeoClientID: '',
  bannerText: 'Désormais, vous pouvez payer votre abonnement PRO par Mobile Money et Paypal!',
  bannerLink: 'https://google.com',
  bannerActionBtn: 'Je deviens PRO',
  bannerBgColor: '#333',
  bannerVisible: 'false'
};
```

Run `ng serve` for a **client-side** dev server.  
Run `npm run dev:ssr` for a **server-side** dev server.  
Navigate to `http://localhost:4200/`. The app will automatically reload if you make any change in the source files.

## Build

Run `ng build` to build the **client-side project** bundle. The build artefacts will be stored in the `dist/` directory.

Run `npm run build:ssr` to build the **server-side project** bundle. The build artefacts will be stored in the `dist/` directory.  
Run `npm run serve:ssr` and navigate to `http://localhost:4000/` to browse the app.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running End 2 End tests

Run `npm run nw` to launch e2e test

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
