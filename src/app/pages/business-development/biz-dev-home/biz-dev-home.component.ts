import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, DocumentModel, NuxeoPageProviderParams, SearchFilterModel } from '@core/api';
import { Subscription } from 'rxjs';
import { TAB_CONFIG } from '../business-development-tab-config';

@Component({
  selector: 'biz-dev-home',
  styleUrls: ['./biz-dev-home.component.scss'],
  templateUrl: './biz-dev-home.component.html',
})
export class BizDevHomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  tabs: any[] = TAB_CONFIG;

  loading: boolean = true;

  headline: string = 'You name it.';

  extraHeadline: string = 'We\'ve disrupted it.';

  subHead: string = 'Find the who, what, where, when, why and how of our process.';

  placeholder: string = 'Search for roadmaps, disruption days and how-tos...';

  assetUrlMapping: object = {
    'App-Disruption-Day': '/p/disruption/Disruption Days/day',
    'App-Disruption-Theory-Folder': '/p/disruption/Disruption How Tos/folder/',
    '*': '/p/disruption/asset',
  };

  folders: any[];

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: NuxeoPageProviderParams): boolean => searchParams.hasFilter('the_loupe_main_brand_agg') }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
  };

  folderParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_FOLDER_TYPE,
  };

  constructor(
    private advanceSearch: AdvanceSearch) {
  }

  ngOnInit() {
    this.search(this.folderParams);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.folders = res.entries.filter((doc: DocumentModel) => this.tabs.some(x => doc.title === x.title));
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

}
