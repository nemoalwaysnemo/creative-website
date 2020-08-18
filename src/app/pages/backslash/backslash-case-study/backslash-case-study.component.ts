import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { Subject, timer } from 'rxjs';
import { DocumentModel, GlobalSearchParams, SearchFilterModel, NuxeoRequestOptions } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
@Component({
  selector: 'backslash-case-study',
  styleUrls: ['./backslash-case-study.component.scss'],
  templateUrl: './backslash-case-study.component.html',
})
export class BackslashCaseStudyComponent extends GlobalDocumentViewComponent implements OnInit {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

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

  baseParams$: Subject<any> = new Subject<any>();

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  beforeSearch: Function = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword()) {
      searchParams = this.buildSearchAssetsParams(searchParams);
    }
    return { searchParams, opts };
  }


  ngOnInit(): void {
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
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_SUB_FOLDER_TYPE,
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
      ecm_path_eq: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_BASE_FOLDER_TYPE,
    };
  }

  protected buildDefaultAssetsParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_SUB_FOLDER_TYPE,
    };
    if (doc) {
      params['ecm_parentId'] = doc.uid;
    }
    return new GlobalSearchParams(params);
  }

}
