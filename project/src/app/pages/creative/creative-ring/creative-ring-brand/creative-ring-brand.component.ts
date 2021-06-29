import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';
import { DocumentModel, UserModel } from '@core/api';
import { Subject } from 'rxjs';

@Component({
  selector: 'creative-ring-brand',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-brand.component.scss'],
  templateUrl: './creative-ring-brand.component.html',
})
export class CreativeRingBrandComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
  ];

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
    the_loupe_main_collection_type: NUXEO_DOC_TYPE.CREATIVE_BRAND_COLLECTION_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'creative-ring-brand',
    enableQueryParams: true,
  });

  document: DocumentModel;

  onSearching: boolean = true;

  currentView: string = 'thumbnailView';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  onLoading(loading: boolean): void {
    this.onSearching = loading;
  }

  onResultViewChanged(name: string): void {
    this.currentView = name;
  }

  protected setCurrentDocument(doc: DocumentModel, user: UserModel): void {
    super.setCurrentDocument(doc, user);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_FOLDER_TYPE,
    };
  }
}
