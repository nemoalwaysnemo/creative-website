import { Credentials, AuthenticationToken } from './base.interface';
import { Observable, empty } from 'rxjs';

export const BearerAuth: any = {

  computeAuthenticationHeaders: (auth: Credentials): any => {
    const headers: any = {};
    if (auth.token) {
      const accessToken = auth.token.access_token || auth.token;
      headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
  },

  authenticateURL: (url: string, auth: Credentials): string => {
    if (auth.token) {
      const accessToken = auth.token.access_token || auth.token;
      return `${url}${url.indexOf('?') === -1 ? '?' : '&'}access_token=${accessToken}`;
    }
    return url;
  },

  canRefreshAuthentication: () => true,

  refreshAuthentication: (baseUrl: string, auth: Credentials): Observable<AuthenticationToken> => {
    if (!auth.token.refresh_token || !auth.clientId) {
      return empty();
    }
    //   return oauth2.refreshAccessToken(baseURL, auth.clientId, auth.token.refresh_token)
    //     .then((token) => {
    //       const refreshedAuth = extend(true, {}, auth, { token });
    //       return resolve(refreshedAuth);
    //     })
    //     .catch((e) => reject(e));
    // })
  }
};
