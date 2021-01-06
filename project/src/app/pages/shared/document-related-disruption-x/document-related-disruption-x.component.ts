import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel, SearchResponse } from '@core/api';
import { Subject, timer } from 'rxjs';
import { GLOBAL_DOCUMENT_FORM } from '../global-document-form';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../global-document-dialog';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-related-disruption-x',
  styleUrls: ['./document-related-disruption-x.component.scss'],
  templateUrl: './document-related-disruption-x.component.html',
})
export class DocumentRelatedDisruptionXComponent {

  documentModel: DocumentModel;

  documents: DocumentModel[];

  loading: boolean = true;

  append: boolean = false;

  disruptionTitle: string = 'DisruptionX';

  redirectUrl: string = '/p/disruption/asset';

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-related-disruption-x',
    searchGroupPosition: 'left',
    enableSearchInput: false,
  });

  private params: any = {
    pageSize: 8,
    currentPageIndex: 0,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_X_FOLDER_PATH,
  };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.append = false;
      this.documentModel = doc;
      this.search(doc);
    }
  }

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    moreInfo: false,
    enableThumbnailImg: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_X_MODULE_ASSET_FORM,
    ],
    main: GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
  });

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  getRedirectUrl(doc: DocumentModel): string {
    return `${this.redirectUrl}/${doc.uid}`;
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  onLoadMore(res: SearchResponse): void {
    this.append = true;
    const params = this.getSearchParams(this.documentModel);
    params['currentPageIndex'] = res.response.currentPageIndex > 0 ? res.response.currentPageIndex + 1 : 2;
    params['pageSize'] = 4;
    this.baseParams$.next(res.searchParams.setParams(params));
  }

  onResponse(res: SearchResponse): void {
    if (res.source === 'document-related-disruption-x') {
      this.append = false;
    }
  }

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'document-related-disruption-x';
  }

  private search(doc: DocumentModel): void {
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.getSearchParams(doc)); });
    }
  }

  private getSearchParams(doc: DocumentModel): any {
    return Object.assign({}, this.params, { ecm_uuid_not_eq: doc.uid });
  }

}
