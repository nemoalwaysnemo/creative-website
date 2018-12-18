import { Injectable } from '@angular/core';
import { AbstractBaseService } from './api.abstract-base.service';
import { NuxeoApiService, NuxeoRequestOptions, deepExtend } from '@core/api/nuxeo';
import { DocumentModel } from './nuxeo/lib';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentRepository extends AbstractBaseService {

  private defaultRepository: string;

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  get(uuid: string, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.nuxeoApi.repository(this.defaultRepository, this.getRequestOptions(opts)).fetch(uuid);
  }
}
