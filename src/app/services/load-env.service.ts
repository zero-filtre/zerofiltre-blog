import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import envTemplate from 'src/environments/environment.template';
import { environment } from 'src/environments/environment';
import { environment as localEnv } from 'src/environments/environment.locals'; // Just for local developments
import { isPlatformServer } from '@angular/common';


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

    this._loadEnvObject();

  }

  private _loadEnvObject() {
    this.envObject = this.state.get(STATE_ENV_OBJECT, <any>null);

    if (this.envObject == null) {

      if (isPlatformServer(this.platformId)) {

        const envObj: any = {}

        for (const key in envTemplate) {
          if (key == 'production') {
            envObj[key] = true;
            environment[key] = true;
          } else {
            envObj[key] = process.env[(<any>envTemplate)[key]] || ''
            environment[key] = process.env[(<any>envTemplate)[key]] || '';
            environment[key] = localEnv[key]  // Just for local developments
          }
        }

        this.state.set(STATE_ENV_OBJECT, envObj);

      } else {
        // Define environment values here if App would run with CSR
      }
    }
    else {

      for (const key in this.envObject) {
        if (key == 'production') {
          environment[key] = true;
        } else {
          environment[key] = this.envObject[key];
          environment[key] = localEnv[key]  // Just for local developments
        }
      }

    }


  }
}
