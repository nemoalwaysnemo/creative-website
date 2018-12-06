import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { NuxeoAuthService } from './nuxeo.auth.service';
import { Operation } from './lib/nuxeo.operation';
import { Request } from './lib/nuxeo.request';
import { Directory } from './lib/nuxeo.directory';
import { Credentials } from './lib/base.interface';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class NuxeoApiService {

  constructor(private nuxeoAuth: NuxeoAuthService) {

  }

  login(username: string, password: string): Observable<Credentials> {
    return this.nuxeoAuth.login(username, password).pipe(
      mergeMap(response => this.nuxeoAuth.requestAuthenticationToken()),
    );
  }

  operation(id: string, opts: any = {}): Operation {
    return this.nuxeoAuth.nuxeo.operation(id, opts);
  }

  request(path: string, opts: any = {}): Request {
    return this.nuxeoAuth.nuxeo.request(path, opts);
  }

  directory(path: string, opts: any = {}): Directory {
    return this.nuxeoAuth.nuxeo.directory(path, opts);
  }
}
