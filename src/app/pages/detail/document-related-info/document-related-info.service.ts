import { Injectable } from '@angular/core';
import { NuxeoApiService, AbstractPageProvider, NuxeoPageProviderParams, NuxeoPagination, DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { deepExtend } from '@core/services';

export interface DocumentsBag { tag: string; documents: DocumentModel[] }

@Injectable()
export class DocumentRelatedInfoService extends AbstractPageProvider {

  private defaultParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  protected documentsBag$ = new Subject<DocumentsBag>();

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
    this.defaultParams.ecm_path = NUXEO_META_INFO.BASE_FOLDER_PATH;
  }

  protected getRequestParams(opts: any = {}): NuxeoPageProviderParams {
    return deepExtend({}, this.defaultParams, opts);
  }

  get(title: string): Observable<NuxeoPagination> {
    return this.searchForText(title, this.defaultParams);
  }

  searchForText(searchTerm: string, opts: any = {}): Observable<NuxeoPagination> {
    const param = { ecm_fulltext: '*' + searchTerm };
    return this.request(this.getRequestParams(Object.assign({}, param, opts)));
  }

  changeTab(documentsBag: DocumentsBag) {
    this.documentsBag$.next(documentsBag);
  }

  onChangeTab(): Observable<DocumentsBag> {
    return this.documentsBag$.pipe(share());
  }
}
