import { Credentials } from './base.interface';
import { Md5 } from 'ts-md5/dist/md5';
import * as Random from 'random-js';

export const PortalAuth: any = {

  computeAuthenticationHeaders: (auth: Credentials): any => {
    const headers: any = {};
    if (auth.username && auth.password) {
      const timestamp = new Date().getTime();
      const random = Random.engines.mt19937().autoSeed();
      const randomData = random();
      const clearToken = [timestamp, randomData, auth.secret, auth.username].join(':');
      const base64hashedToken = btoa(Md5.hashStr(clearToken).toString());
      headers.NX_RD = randomData;
      headers.NX_TS = timestamp;
      headers.NX_TOKEN = base64hashedToken;
      headers.NX_USER = auth.username;
    }
    return headers;
  },

};
