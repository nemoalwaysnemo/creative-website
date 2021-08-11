import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, GlobalSearchParams, NuxeoRequestOptions } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '../../shared';
import { Subject, timer } from 'rxjs';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-edge',
  styleUrls: ['./backslash-edge.component.scss'],
  templateUrl: './backslash-edge.component.html',
})
export class BackslashEdgeComponent extends GlobalDocumentViewComponent implements OnInit {

  tabConfig: any = TAB_CONFIG;

  baseParams$: Subject<any> = new Subject<any>();

  filters: SearchFilterModel[] = [
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  beforeSearch: (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => { searchParams: GlobalSearchParams; opts: NuxeoRequestOptions } = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
    }
    return { searchParams, opts };
  };

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

  // get all matched assets and their parent folders
  protected buildSearchAssetsParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      currentPageIndex: searchParams.getSettings('append') ? searchParams.providerParams.currentPageIndex : 0,
      pageSize: searchParams.getSettings('append') ? searchParams.providerParams.pageSize : GlobalSearchParams.PageSize,
      ecm_mixinType_not_in: '',
      ecm_fulltext: searchParams.providerParams.ecm_fulltext_wildcard,
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_EDGE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_SUB_FOLDER_TYPE,
    };
    return searchParams.setParams(params);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildDefaultAssetsParams(doc)); });
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: this.documentPageService.getConfig('path:BACKSLASH_EDGE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_BASE_FOLDER_TYPE,
    };
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: this.documentPageService.getConfig('path:BACKSLASH_EDGE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_EDGE_SUB_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
  }

}
