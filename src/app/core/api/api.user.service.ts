import { Injectable } from '@angular/core';
import { NuxeoApiService } from './nuxeo';
import { CacheService } from '@core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel, DocumentModel, NuxeoAutomations, NuxeoResponse } from './nuxeo/lib';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(protected nuxeoApi: NuxeoApiService, private cacheService: CacheService) {
  }

  getCurrentUser(): Observable<UserModel> {
    return this.cacheService.get('User.Current', this.nuxeoApi.operation(NuxeoAutomations.GetCurrentUser, {}, null, { schemas: '*' }).pipe(
      map(res => new UserModel({ properties: res.properties }, this.nuxeoApi.apiOpts)),
    ));
  }

  getFavoriteDocument(): Observable<DocumentModel> {
    return this.cacheService.get('Favorite.UserFavoriteDocument', this.nuxeoApi.operation(NuxeoAutomations.GetFavorite));
  }

  addFavoriteDocument(uids: string[]): Observable<NuxeoResponse> {
    return this.nuxeoApi.operation(NuxeoAutomations.AddToFavorite, {}, uids);
  }
}
