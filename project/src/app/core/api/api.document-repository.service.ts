import { Injectable } from '@angular/core';
import { NuxeoApiService, NuxeoRequestOptions } from '@core/api/nuxeo';
import { DocumentModel } from './nuxeo/lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentRepository {

  private defaultRepository: string;

  constructor(protected nuxeoApi: NuxeoApiService) {
  }

  get(uuid: string, opts?: any): Observable<DocumentModel> {
    return this.nuxeoApi.repository(this.defaultRepository, new NuxeoRequestOptions(opts)).fetch(uuid);
  }

  create(doc: DocumentModel): Observable<DocumentModel> {
    return this.nuxeoApi.repository(this.defaultRepository).create(doc.path, doc);
  }
}
