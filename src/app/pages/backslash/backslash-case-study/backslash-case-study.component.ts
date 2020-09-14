import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../backslash-tab-config';
import { GlobalSearchParams, SearchFilterModel, NuxeoRequestOptions, NuxeoPagination } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-case-study',
  styleUrls: ['./backslash-case-study.component.scss'],
  templateUrl: './backslash-case-study.component.html',
})
export class BackslashCaseStudyComponent extends GlobalDocumentViewComponent implements OnInit {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  onSearching: boolean = true;

  currentView: string = 'categoryView';

  enableScrolling: any = { categoryView: true, reportView: true };

  regions: any[];

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

  folderAssetParams: any = {
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_FOLDER_ASSETS,
  };

  categorySearchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: false,
  });

  reportSearchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-backslash-report',
    enableQueryParams: false,
  });

  protected enabledView: any = { categoryView: true };

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

  private getRegions(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.regions = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
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

}
