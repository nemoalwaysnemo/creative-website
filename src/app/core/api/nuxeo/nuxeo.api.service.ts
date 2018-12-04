import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { NuxeoAuthService } from './nuxeo.auth.service';
import { Operation } from './lib/nuxeo.operation';
import { Request } from './lib/nuxeo.request';
import {Directory } from './lib/nuxeo.directory';

@Injectable()
export class NuxeoApiService {

  constructor(protected nuxeoAuth: NuxeoAuthService) {

  }

  login(username: string, password: string): Observable<any> {
    return this.nuxeoAuth.login(username, password);
  }

  operation(id: string, opts?: {}): Operation {
    return this.nuxeoAuth.nuxeo.operation(id, opts);
  }

  request(path: string, opts?: {}): Request {
    return this.nuxeoAuth.nuxeo.request(path, opts);
  }

  directory(path: string, opts?: {}): Directory {
    return this.nuxeoAuth.nuxeo.directory(path, opts);
  }
}
