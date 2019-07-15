import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, AdvanceSearch, DocumentModel, NuxeoQuickFilters, NuxeoPageProviderParams } from '@core/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'disruption-home',
  styleUrls: ['./disruption-home.component.scss'],
  templateUrl: './disruption-home.component.html',
})
export class DisruptionHomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  loading: boolean = true;

  headline: string = 'You name it.';

  extraHeadline: string = 'We\'ve disrupted it.';

  subHead: string = 'Find the who, what, where, when, Why and how of our process.';

  placeholder: string = 'Search...';

  assetUrlMapping: object = {
    'App-Disruption-Day': '/p/disruption/Disruption Days/day',
    'App-Disruption-Theory-Folder': '/p/disruption/Disruption How Tos/folder/',
    '*': '/p/disruption/asset',
  };

  folders: any[];

  filters: any = {
    'the_loupe_main_assettype_agg': { placeholder: 'Asset Type' },
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'the_loupe_main_country_agg': { placeholder: 'County' },
    'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    'the_loupe_main_clientName_agg': { placeholder: 'Client' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
    'app_edges_backslash_category_agg': { placeholder: 'Category' },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_BASE_FOLDER_PATH,
  };

  folderParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_FOLDER_TYPE,
  };

  private allowedTabs: string[] = ['roadmaps', 'days', 'thinking', 'how tos'];

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
        this.folders = res.entries.filter((doc: DocumentModel) => this.allowedTabs.some(x => doc.title.toLocaleLowerCase().includes(x)));
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

}
