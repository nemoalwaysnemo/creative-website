import { Credentials } from './base.interface';

export const TokeAuth: any = {

  computeAuthenticationHeaders: (auth: Credentials): any => {
    const headers = {};
    if (auth.token) {
      headers['X-Authentication-Token'] = auth.token;
    }
    return headers;
  },

  authenticateURL: (url: string, auth: Credentials): string => {
    if (auth.token) {
      return `${url}${url.indexOf('?') === -1 ? '?' : '&'}token=${auth.token}`;
    }
    return url;
  },
};
