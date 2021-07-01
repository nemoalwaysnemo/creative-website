import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, UserModel } from '@core/api';
import { SelectableItemService } from '../../../shared/document-selectable';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'creative-ring-agency',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-agency.component.scss'],
  templateUrl: './creative-ring-agency.component.html',
})
export class CreativeRingAgencyComponent extends GlobalDocumentViewComponent {

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
    the_loupe_main_collection_type: NUXEO_DOC_TYPE.CREATIVE_RING_AGENCY_COLLECTION_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'creative-ring-agency',
    enableQueryParams: true,
  });

  currentView: string = 'listView';

  filters: SearchFilterModel[] = [];

  onSearching: boolean = true;

  constructor(
    private selectableItemService: SelectableItemService,
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
