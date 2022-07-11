import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import envTemplate from 'src/environments/environment.template';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';


const STATE_ENV = makeStateKey('env-value');


@Injectable({
  providedIn: 'root'
})
export class LoadEnvService {

  private ENV_NAME = 'env-value';

  public envValue!: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private state: TransferState,
  ) {

    this.loadEnv();

  }

  private loadEnv() {

    this.envValue = this.state.get(STATE_ENV, <any>null);

    if (!this.envValue) {
      let env: any = {}

      for (const key in envTemplate) {
        env[key] = process.env[(<any>envTemplate)[key]]
        environment[key] = process.env[(<any>envTemplate)[key]];
      }

      this.state.set(STATE_ENV, env);
    }
    else {

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.ENV_NAME, JSON.stringify(this.envValue));

        for (const key in this.envValue) {
          environment[key] =  this.envValue[key];
        }

      }

    }


  }
}
