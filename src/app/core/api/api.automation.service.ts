import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NuxeoApiService, NuxeoRequestOptions } from '@core/api/nuxeo';
import { AbstractBaseService } from './api.abstract-base.service';

@Injectable()
export class Automation extends AbstractBaseService {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  execute(id: string, params: any = {}): Observable<any> {
    return this.nuxeoApi.operation(id).params(params).execute();
  }

}
