import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { NuxeoApiService } from './nuxeo';
import { NbAuthService } from '../nebular/auth';
import { AbstractBaseService } from './api.abstract-base.service';

@Injectable()
export class UserService extends AbstractBaseService {

  constructor(protected nuxeoApi: NuxeoApiService, private authService: NbAuthService) {
    super(nuxeoApi);
  }

  getCurrentUser() {

  }

}
