import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NuxeoApiService } from './nuxeo';
import { UserModel, DocumentModel, NuxeoAutomations, NuxeoRequestOptions } from './nuxeo/lib';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { switchMap, tap } from 'rxjs/operators';
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
          return this.nuxeoApi.operation(NuxeoAutomations.GetCurrentUser, {}, null, new NuxeoRequestOptions({ schemas: ['*'] })).pipe(
            tap(res => { }),
          );
          // return this.cacheService.get('Favorite.UserFavoriteDocument', this.nuxeoApi.operation(NuxeoAutomations.GetCurrentUser));
          return this.nuxeoApi.getUser(token.getValue());
        }),
      );
  }

  getFavoriteDocument(): Observable<DocumentModel> {
    return this.cacheService.get('Favorite.UserFavoriteDocument', this.nuxeoApi.operation(NuxeoAutomations.GetFavorite));
  }

}
