import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSearchParams, SearchFilterModel, NuxeoRequestOptions, NuxeoPagination, DocumentModel } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { TAB_CONFIG } from '../backslash-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-region',
  styleUrls: ['./backslash-region.component.scss'],
  templateUrl: './backslash-region.component.html',
})
export class BackslashRegionComponent extends GlobalDocumentViewComponent implements OnInit {

  tabConfig: any = TAB_CONFIG;

  regions: DocumentModel[] = [];

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_report_region_agg', placeholder: 'Region' }),
  ];

  regionAssetParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_REGION_FOLDER_TYPE,
  };

  categorySearchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings();

  beforeSearch: (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => {
    if (searchParams.hasFilters && searchParams.hasNoFulltextSearch()) {
      searchParams = this.buildSearchRegionParams(searchParams);
    } else if (searchParams.hasKeyword()) {
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

  ngOnInit(): void {
  }

  protected buildSearchAssetsParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      currentPageIndex: searchParams.getSettings('append') ? searchParams.providerParams.currentPageIndex : 0,
      pageSize: searchParams.getSettings('append') ? searchParams.providerParams.pageSize : GlobalSearchParams.PageSize,
      ecm_mixinType_not_in: '',
      ecm_fulltext: searchParams.providerParams.ecm_fulltext_wildcard,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_ASSET_TYPE,
    };
    return searchParams.setParams(params);
  }

  protected buildSearchRegionParams(searchParams: GlobalSearchParams): GlobalSearchParams {
    const params: any = {
      currentPageIndex: searchParams.getSettings('append') ? searchParams.providerParams.currentPageIndex : 0,
      pageSize: searchParams.getSettings('append') ? searchParams.providerParams.pageSize : GlobalSearchParams.PageSize,
      ecm_mixinType_not_in: '',
      // ecm_fulltext: searchParams.providerParams.ecm_fulltext_wildcard,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_REGION_FOLDER_TYPE,
    };
    return searchParams.setParams(params);
  }
}
