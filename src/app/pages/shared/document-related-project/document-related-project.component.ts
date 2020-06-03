import { Component, Input, OnDestroy } from '@angular/core';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { Subject, Subscription } from 'rxjs';
import { AdvanceSearchService, NuxeoPagination, DocumentModel, SearchResponse } from '@core/api';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';

@Component({
  selector: 'document-related-project',
  styleUrls: ['./document-related-project.component.scss'],
  templateUrl: './document-related-project.component.html',
})
export class DocumentRelatedProjectComponent implements OnDestroy {

  layout: string = 'my_agency full-width';

  documentModel: DocumentModel;

  append: boolean = true;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings;

  documents: DocumentModel[];

  noResultText: string = 'No more assets';

  private subscription: Subscription = new Subscription();

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
      this.search();
    }
  }

  constructor(private advanceSearchService: AdvanceSearchService) {
    this.baseParams$.subscribe(p => {
      console.log('pppp', p);
    });
   }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLoadMore(res: SearchResponse): void {
    this.append = true;
    const params = this.getSearchParams(this.documentModel);
    params['currentPageIndex'] = res.response.currentPageIndex + 1;
    params['pageSize'] = 8;
    console.log(1231);
    this.baseParams$.next(params);
  }

  getSearchParams(doc: DocumentModel): any {
    const params = this.params;
    params.the_loupe_main_brand_any = `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`;
    params.ecm_uuid_not_eq = doc.uid;
    return params;
  }

  search(): void {
    this.searchFormSettings = new GlobalSearchFormSettings({
      source: 'document-related-project',
      searchGroupPosition: 'left',
    });
    console.log(222, this.getSearchParams(this.documentModel));

    this.baseParams$.next(this.getSearchParams(this.documentModel));
  }

  onSearchFilter(res: SearchResponse): boolean {
    console.log(11, res);

    return res.metadata.source === 'document-related-project';
  }
}
