import { Component, OnInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { AdvanceSearchService, DocumentModel, NuxeoPageProviderParams, SearchFilterModel, NuxeoPageProviderConstants, NuxeoRequestOptions, NuxeoEnricher } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { TAB_CONFIG } from '../business-development-tab-config';
import { parseTabRoute } from '@core/services/helpers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biz-dev-thought-leadership-page',
  styleUrls: ['./biz-dev-thought-leadership.component.scss'],
  templateUrl: './biz-dev-thought-leadership.component.html',
})
export class BizDevThoughtLeadershipComponent extends GlobalDocumentViewComponent implements OnInit {

  baseParams$: Subject<any> = new Subject<any>();

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
    }
    return { searchParams, opts };
  }


  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService) {
    super(advanceSearchService, activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  // get all matched assets and their parent folders
  protected buildSearchAssetsParams(queryParams: NuxeoPageProviderParams): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_mixinType_not_in: '',
      ecm_fulltext: queryParams.ecm_fulltext_wildcard,
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_SUB_FOLDER_TYPE,
    };
    return new NuxeoPageProviderParams(params);
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
      ecm_path_eq: NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_BASE_FOLDER_TYPE,
      ecm_mixinType_not_in: '', // override
    };
  }

  protected buildDefaultAssetsParams(doc?: DocumentModel): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_SUB_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new NuxeoPageProviderParams(params);
  }

}
