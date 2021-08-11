import { Component, Input, TemplateRef } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../global-document-dialog';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'document-related-brand',
  styleUrls: ['./document-related-brand.component.scss'],
  templateUrl: './document-related-brand.component.html',
})
export class DocumentRelatedBrandComponent {

  layout: string = 'my_agency full-width';

  documentModel: DocumentModel;

  append: boolean = false;

  documents: DocumentModel[];

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-related-brand',
    searchGroupPosition: 'left',
    enableSearchInput: false,
  });

  private params: any = {
    pageSize: 4,
    ecm_path: this.documentPageService.getConfig('path:CREATIVE_TBWA_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_TYPES,
    the_loupe_main_brand_any: '',
    ecm_uuid_not_eq: '',
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
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_ASSET] });

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  search(doc: DocumentModel): void {
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.getSearchParams(doc)); });
    }
  }

  onLoadMore(res: SearchResponse): void {
    this.append = true;
    const params = this.getSearchParams(this.documentModel);
    params['currentPageIndex'] = res.response.currentPageIndex + 1;
    params['pageSize'] = 4;
    this.baseParams$.next(res.searchParams.setParams(params));
  }

  onResponse(res: SearchResponse): void {
    if (res.source === 'document-related-brand') {
      this.append = false;
    }
  }

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'document-related-brand';
  }

  private getSearchParams(doc: DocumentModel): any {
    return Object.assign({}, this.params, {
      the_loupe_main_brand_any: `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`,
      ecm_uuid_not_eq: doc.uid,
    });
  }

}
