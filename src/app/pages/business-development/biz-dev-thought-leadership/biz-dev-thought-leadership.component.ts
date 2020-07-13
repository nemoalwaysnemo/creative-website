import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, NuxeoPageProviderParams, SearchFilterModel, NuxeoRequestOptions } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../business-development-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

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

  beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions, metadata: any): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams, metadata);
    }
    return { searchParams, opts };
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  // get all matched assets and their parent folders
  protected buildSearchAssetsParams(searchParams: NuxeoPageProviderParams, metadata: any = {}): NuxeoPageProviderParams {
    const params = {
      currentPageIndex: metadata.append ? searchParams.currentPageIndex : 0,
      pageSize: metadata.append ? searchParams.pageSize : 20,
      ecm_mixinType_not_in: '',
      ecm_fulltext: searchParams.ecm_fulltext_wildcard,
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_THOUGHT_LEADERSHIP_SUB_FOLDER_TYPE,
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
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_THOUGHT_LEADERSHIP_BASE_FOLDER_TYPE,
      ecm_mixinType_not_in: '', // override
    };
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): NuxeoPageProviderParams {
    const params = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_THOUGHT_LEADERSHIP_SUB_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new NuxeoPageProviderParams(params);
  }

}
