import { Injectable } from '@angular/core';
import { Env, Environment } from '@environment/environment';
import { NUXEO_PATH_INFO, NUXEO_OUTER_LINK, ENV_OVERRIDES } from '@environment/environment.config';

@Injectable({
  providedIn: 'root',
})
export class AppEnvService {

  private host: Env;

  constructor() {

  }

  get env(): Env {
    return this.host;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      this.setEnvVariables();
      resolve();
    });
  }

  getConfig(path: string): any {
    return this.getServerConfig(path);
  }

  private setEnvVariables(): void {
    const hostname = window && window.location && window.location.hostname;
    this.host = this.checkServerHost(hostname);
    if (this.host === Env.local) {
      this.host = this.checkServerHost(Environment.nuxeoUrl);
    }
    // console.log(hostname, this.env);
  }

  private getServerConfig(path: string): string {
    const keys = path.split(':');
    const key = keys.shift();
    const prop = keys.shift();
    let value = this.getValue(ENV_OVERRIDES[this.env] || { NUXEO_PATH_INFO, NUXEO_OUTER_LINK }, key, prop);
    if (!value) {
      value = this.getValue({ NUXEO_PATH_INFO, NUXEO_OUTER_LINK }, key, prop);
    }
    return value;
  }

  private getValue(data: any = {}, name: string, prop: string): string {
    let value = null;
    if (name === 'path') {
      value = data['NUXEO_PATH_INFO'][prop];
    } else if (name === 'link') {
      value = data['NUXEO_OUTER_LINK'][prop];
    }
    return value;
  }

  private checkServerHost(url: string): Env {
    if (/^.*localhost.*/.test(url)) {
      return Env.local;
    } else if (/library-dev.factory.tools/.test(url)) {
      return Env.dev;
    } else if (/library-staging.factory.tools/.test(url)) {
      return Env.stag;
    } else if ((/library.factory.tools/.test(url)) || /knowledge.tbwa.com/.test(url)) {
      return Env.prod;
    } else {
      console.warn(`Cannot find environment for host ${url}`);
      return Env.dev;
    }
  }

}
