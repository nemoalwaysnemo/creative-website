import { Component, Input, OnDestroy } from '@angular/core';
import { AdvanceSearchService, NuxeoPagination, DocumentModel, SearchResponse } from '@core/api';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { Subject, timer, Subscription } from 'rxjs';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';

@Component({
  selector: 'document-related-agency',
  styleUrls: ['./document-related-agency.component.scss'],
  templateUrl: './document-related-agency.component.html',
})
export class DocumentRelatedAgencyComponent implements OnDestroy {

  layout: string = 'my_agency full-width';

  documentModel: DocumentModel;

  loading: boolean = true;

  documents: DocumentModel[];

  noResultText: string = 'No more assets';

  append: boolean = true;

  private subscription: Subscription = new Subscription();

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-related-agency',
    searchGroupPosition: 'left',
    enableSearchInput: false,
  });

  private params: any = {
    pageSize: 4,
    app_global_networkshare: true,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    the_loupe_main_agency: '',
    ecm_uuid_not_eq: '',
  };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.search(doc);
    }
  }

  constructor(private advanceSearchService: AdvanceSearchService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(doc: DocumentModel): void {
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.getSearchParams(doc)); });
    }
  }

  getSearchParams(doc: DocumentModel): any {
    const params = this.params;
    params.the_loupe_main_agency = doc.get('The_Loupe_Main:agency');
    params.the_loupe_main_brand_not_in = `["${doc.get('The_Loupe_Main:brand')}"]`;
    params.ecm_uuid_not_eq = doc.uid;
    return params;
  }

  onLoadMore(res: SearchResponse): void {
    this.append = true;
    const params = this.getSearchParams(this.documentModel);
    params['currentPageIndex'] = res.response.currentPageIndex + 1;
    params['pageSize'] = 4;
    this.baseParams$.next(Object.assign({}, params));
  }

  onSearchFilter(res: SearchResponse): boolean {
    return res.metadata.source === 'document-related-agency';
  }
}
