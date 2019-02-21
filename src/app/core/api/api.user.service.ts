import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { NuxeoApiService } from './nuxeo';
import { UserModel } from './nuxeo/lib';
import { AbstractBaseService } from './api.abstract-base.service';

@Injectable()
export class UserService extends AbstractBaseService {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  getCurrentUser(): Observable<UserModel> {
    return this.nuxeoApi.currentUser;
  }

}
