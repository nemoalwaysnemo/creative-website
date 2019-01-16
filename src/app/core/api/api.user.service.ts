import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NuxeoApiService } from './nuxeo';
import { UserModel } from './nuxeo/lib';
import { NbAuthService } from '../nebular/auth';
import { NuxeoAuthToken } from '../auth/nuxeo-auth-token';
import { AbstractBaseService } from './api.abstract-base.service';

@Injectable()
export class UserService extends AbstractBaseService {

  constructor(protected nuxeoApi: NuxeoApiService, private authService: NbAuthService) {
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

}
