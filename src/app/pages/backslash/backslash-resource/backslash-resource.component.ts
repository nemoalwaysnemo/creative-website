import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseTabRoute } from '@core/services/helpers';
import { Subject, timer } from 'rxjs';
import { TAB_CONFIG } from '../backslash-tab-config';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentModel, GlobalSearchParams, SearchFilterModel, NuxeoRequestOptions, NuxeoSearchConstants } from '@core/api';

@Component({
  selector: 'backslash-resource',
  styleUrls: ['./backslash-resource.component.scss'],
  templateUrl: './backslash-resource.component.html',
})
export class BackslashResourceComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  beforeSearch: Function = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
    }
    return { searchParams, opts };
  }

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
      ecm_path_eq: NUXEO_PATH_INFO.BACKSLASH_RESOURCES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_BASE_FOLDER_TYPE,
    };
  }

  // get all matched assets and their parent folders
  protected buildSearchAssetsParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      currentPageIndex: searchParams.getSettings('append') ? searchParams.providerParams.currentPageIndex : 0,
      pageSize: searchParams.getSettings('append') ? searchParams.providerParams.pageSize : GlobalSearchParams.PageSize,
      ecm_mixinType_not_in: '',
      ecm_fulltext: searchParams.providerParams.ecm_fulltext_wildcard,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_RESOURCES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_SUB_FOLDER_TYPE,
    };
    return searchParams.setParams(params);
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_RESOURCES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_SUB_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
  }
}
