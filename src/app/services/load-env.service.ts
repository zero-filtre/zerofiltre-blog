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

  public envObject!: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private state: TransferState,
  ) {

    // this.loadEnvObject();

  }

  loadEnvObject() {

    this.envObject = this.state.get(STATE_ENV_OBJECT, <any>null);

    console.log('ENV_OBJECT: ', this.envObject);

    if (this.envObject == null) {

      if (isPlatformServer(this.platformId)) {
        console.log('SSR RUNING...')

        const envObj: any = {}

        for (const key in envTemplate) {
          if (key == 'production') {
            envObj[key] = true;
            environment[key] = true;
          } else {
            envObj[key] = process.env[(<any>envTemplate)[key]] || ''
            environment[key] = process.env[(<any>envTemplate)[key]] || '';
          }
        }

        this.state.set(STATE_ENV_OBJECT, envObj);

      } else {
        console.log('CSR RUNING...')
        // Define environment values here if App would run on CSR
      }
    }
    else {

      console.log('CSR READING SSR VALUES...')
      console.log('ENV_OBJECT_BEFORE: ', environment);

      for (const key in this.envObject) {
        if (key == 'production') {
          environment[key] = true;
        } else {
          environment[key] = this.envObject[key];
        }
      }

      console.log('ENV_OBJECT_AFTER: ', environment);

    }


  }
}
