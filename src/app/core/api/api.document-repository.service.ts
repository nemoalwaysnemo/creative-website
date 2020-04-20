import { Injectable } from '@angular/core';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { NuxeoApiService, NuxeoRequestOptions } from '@core/api/nuxeo';
import { DocumentModel } from './nuxeo/lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentRepository extends AbstractBaseSearchService {

  private defaultRepository: string;

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  get(uuid: string, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.nuxeoApi.repository(this.defaultRepository, this.getRequestOptions(opts)).fetch(uuid);
  }

  create(doc: DocumentModel): Observable<DocumentModel> {
    return this.nuxeoApi.repository(this.defaultRepository).create(doc.path, doc);
  }
}
