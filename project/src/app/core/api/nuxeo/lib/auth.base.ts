import { Credentials } from './base.interface';

export const BaseAuth: any = {

  computeAuthenticationHeaders: (auth: Credentials): any => {
    const headers: any = {};
    if (auth.username && auth.password) {
      const base64 = btoa(`${auth.username}:${auth.password}`);
      const authorization = `Basic ${base64}`;
      headers.Authorization = authorization;
    }
    return headers;
  },

  authenticateURL: (url: string, auth: Credentials): string => {
    if (auth.username && auth.password) {
      return url.replace('://', `://${auth.username}:${auth.password}@`);
    }
    return url;
  },
};
