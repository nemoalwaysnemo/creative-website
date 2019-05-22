import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NuxeoApiService } from './nuxeo';
import { UserModel, DocumentModel, NuxeoAutomations } from './nuxeo/lib';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { switchMap } from 'rxjs/operators';
import { NbAuthService } from '@core/nebular/auth/services/auth.service';
import { NuxeoAuthToken } from '@core/auth/nuxeo-auth-token';
import { CacheService } from '@core/services';

@Injectable()
export class UserService extends AbstractBaseSearchService {

  constructor(
    protected nuxeoApi: NuxeoApiService,
    private authService: NbAuthService,
    private cacheService: CacheService,
  ) {
    super(nuxeoApi);
  }

  getCurrentUser(): Observable<UserModel> {
    return this.authService.getToken()
      .pipe(
        switchMap((token: NuxeoAuthToken) => {
          return this.nuxeoApi.getUser(token.getValue().username);
        }),
      );
  }

  getFavoriteDocument(): Observable<DocumentModel> {
    return this.cacheService.get('Favorite.UserFavoriteDocument', this.nuxeoApi.operation(NuxeoAutomations.GetFavorite));
  }

}
