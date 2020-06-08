import { Component, Input } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-related-brand',
  styleUrls: ['./document-related-brand.component.scss'],
  templateUrl: './document-related-brand.component.html',
})
export class DocumentRelatedBrandComponent {

  layout: string = 'my_agency full-width';

  documentModel: DocumentModel;

  append: boolean = true;

  documents: DocumentModel[];

  noResultText: string = 'No more assets';

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-related-brand',
    searchGroupPosition: 'left',
    enableSearchInput: false,
  });

  private params: any = {
    pageSize: 4,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_TYPES,
    the_loupe_main_brand_any: '',
    ecm_uuid_not_eq: '',
  };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.search(doc);
    }
  }

  search(doc: DocumentModel): void {
    timer(0).subscribe(() => {
      this.baseParams$.next(this.getSearchParams(doc)); });
  }

  onLoadMore(res: SearchResponse): void {
    const params = this.getSearchParams(this.documentModel);
    params['currentPageIndex'] = res.response.currentPageIndex + 1;
    params['pageSize'] = 4;
    this.baseParams$.next(Object.assign({}, params));
  }

  getSearchParams(doc: DocumentModel): any {
    const params = this.params;
    params.the_loupe_main_brand_any = `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`;
    params.ecm_uuid_not_eq = doc.uid;
    return Object.assign({}, params);
  }

  onSearchFilter(res: SearchResponse): boolean {
    return res.source === 'document-related-brand';
  }

}
