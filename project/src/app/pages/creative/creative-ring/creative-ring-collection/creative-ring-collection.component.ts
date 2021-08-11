import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, UserModel } from '@core/api';
import { SelectableItemService } from '../../../shared/document-selectable';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-ring-collection',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-collection.component.scss'],
  templateUrl: './creative-ring-collection.component.html',
})
export class CreativeRingCollectionComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  filters: SearchFilterModel[] = [
  ];

  featuredParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: this.documentPageService.getConfig('path:CREATIVE_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'creative-ring-my-collections',
    enableQueryParams: true,
  });

  featuredSearchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'creative-ring-all-collections',
    enableQueryParams: true,
  });

  onSearching: boolean = true;

  currentView: string = 'myCollectionsView';

  enableScrolling: any = { myCollectionsView: true, allCollectionsView: true };

  protected enabledView: any = { myCollectionsView: true };

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

  selectView(view: string): void {
    if (!this.onSearching) {
      this.performViewTemplate(view);
    }
  }

  isViewEnabled(name: string): boolean {
    return this.enabledView[name];
  }

  protected performViewTemplate(name: string): void {
    this.currentView = name;
    if (!this.enabledView[name]) {
      this.enabledView[name] = true;
    }
    for (const key in this.enableScrolling) {
      if (key === name) {
        this.enableScrolling[key] = true;
      } else {
        this.enableScrolling[key] = false;
      }
    }
  }

  protected setCurrentDocument(doc: DocumentModel, user: UserModel): void {
    super.setCurrentDocument(doc, user);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc, user)); });
      this.selectableItemService.clear();
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: this.documentPageService.getConfig('path:CREATIVE_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_FOLDER_TYPE,
    };
  }

  protected buildAssetsParams(doc: DocumentModel, user: UserModel): any {
    // my collections
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: this.documentPageService.getConfig('path:CREATIVE_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
    };
    if (doc) {
      params['dc_creator'] = `["${user.username}"]`;
    }
    return params;
  }
}
