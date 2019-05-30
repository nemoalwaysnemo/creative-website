import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NuxeoApiService } from './nuxeo';
import { UserModel, DocumentModel, NuxeoAutomations } from './nuxeo/lib';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { switchMap, map } from 'rxjs/operators';
import { CacheService } from '@core/services';
import { NbAuthService, NbAuthToken } from '../base-auth/services';

@Injectable()
export class UserService extends AbstractBaseSearchService {

  constructor(
    protected nuxeoApi: NuxeoApiService,
    private authService: NbAuthService,
    private cacheService: CacheService,
  ) {
    super(nuxeoApi);
  }

  getCurrentUser(): Observable<any> {
    return this.authService.getToken()
      .pipe(
        switchMap((token: NbAuthToken) => {
          return this.cacheService.get('TBWA.GetAccessTokenInfo', this.nuxeoApi.operation(NuxeoAutomations.GetAccessTokenInfo, { token: token.getValue() }).pipe(
            map(res => new UserModel({ properties: { username: res.value.nuxeoLogin } }, this.nuxeoApi.apiOpts)),
          ));
        }),
      );
  }

  getFavoriteDocument(): Observable<DocumentModel> {
    return this.cacheService.get('Favorite.UserFavoriteDocument', this.nuxeoApi.operation(NuxeoAutomations.GetFavorite));
  }

}
