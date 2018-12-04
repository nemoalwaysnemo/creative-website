import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NuxeoAuthService } from './nuxeo.auth.service';

@Injectable()
export class NuxeoApiService {

  constructor(protected nuxeoAuth: NuxeoAuthService) {

  }

  login(username: string, password: string): Observable<any> {
    return this.nuxeoAuth.login(username, password);
  }

  operation() {

  }
}
