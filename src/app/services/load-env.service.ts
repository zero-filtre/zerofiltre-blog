import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import envTemplate from 'src/environments/environment.template';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';


const STATE_ENV_OBJECT = makeStateKey('env-value');


@Injectable({
  providedIn: 'root'
})
export class LoadEnvService {

  public serverEnvObject!: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private state: TransferState,
  ) {

    this.loadEnvObject();

  }

  private loadEnvObject() {

    this.serverEnvObject = this.state.get(STATE_ENV_OBJECT, <any>null);

    if (!this.serverEnvObject) {

      if (isPlatformServer(this.platformId)) {
        console.log('SSR RUNING...')

        const envObj: any = {}

        for (const key in envTemplate) {
          envObj[key] = process.env[(<any>envTemplate)[key]]
          environment[key] = process.env[(<any>envTemplate)[key]];
        }

        this.state.set(STATE_ENV_OBJECT, envObj);
      } else {
        console.log('CSR RUNING...')
        // Define environment values here if App would run on CSR
      }
    }
    else {

      if (isPlatformBrowser(this.platformId)) {
        console.log('CSR READING SSR VALUES...')

        for (const key in this.serverEnvObject) {
          environment[key] = this.serverEnvObject[key];
        }

      }

    }


  }
}
