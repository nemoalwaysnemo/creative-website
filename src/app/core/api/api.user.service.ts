import { Injectable } from '@angular/core';
import { NuxeoApiService } from './nuxeo';
import { CacheService } from '@core/services';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { UserModel, DocumentModel, NuxeoAutomations } from './nuxeo/lib';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { NbAuthService, NbAuthToken } from '../base-auth/services';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractBaseSearchService {

  constructor(
    protected nuxeoApi: NuxeoApiService,
    private authService: NbAuthService,
    private cacheService: CacheService,
  ) {
    super(nuxeoApi);
  }

  getCurrentUser(): Observable<UserModel> {
    return this.cacheService.get('User.Current', this.authService.getToken().pipe(
      concatMap((token: NbAuthToken) => this.nuxeoApi.operation(NuxeoAutomations.GetAccessTokenInfo, { token: token.getValue() }).pipe(
        map(res => new UserModel({ properties: { username: res.value.nuxeoLogin } }, this.nuxeoApi.apiOpts)),
      )),
    ));
  }

  getFavoriteDocument(): Observable<DocumentModel> {
    return this.cacheService.get('Favorite.UserFavoriteDocument', this.nuxeoApi.operation(NuxeoAutomations.GetFavorite));
  }

  getCurrentUserInfo(): Observable<UserModel> {
    return this.cacheService.get('User.Info', this.getCurrentUser().pipe(
      concatMap((user: UserModel) => this.nuxeoApi.getUser(user.username)),
    ));
  }
}
