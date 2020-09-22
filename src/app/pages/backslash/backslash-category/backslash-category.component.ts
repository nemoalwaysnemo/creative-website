import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSearchParams, SearchFilterModel, NuxeoRequestOptions, NuxeoPagination, DocumentModel } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-category',
  styleUrls: ['./backslash-category.component.scss'],
  templateUrl: './backslash-category.component.html',
})
export class BackslashCategoryComponent extends GlobalDocumentViewComponent implements OnInit {

  regions: DocumentModel[] = [];

  filters: SearchFilterModel[] = [
    // new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
  ];

  regionAssetParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_REGION_FOLDER_TYPE,
  };

  categoryAssetParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CATEGORY_FOLDER_TYPE,
  };

  categorySearchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings();

  beforeSearch: Function = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => {
    if (searchParams.hasKeyword() || searchParams.hasFilters()) {
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
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
    this.getRegions(this.regionAssetParams);
  }

  // get all matched assets and their parent folders
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

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_BASE_FOLDER_TYPE,
    };
  }

  private getRegions(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.regions = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

}
