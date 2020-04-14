import { Component, OnInit, OnDestroy } from '@angular/core';
import { NUXEO_META_INFO, NUXEO_PATH_INFO } from '@environment/environment';
import { SearchQueryParamsService } from '@pages/shared';
import { AdvanceSearch, SearchFilterModel } from '@core/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'backslash-document-asset-search',
  styleUrls: ['./backslash-document-asset-search.component.scss'],
  templateUrl: './backslash-document-asset-search.component.html',
})
export class BackslashDocumentAssetSearchComponent implements OnInit, OnDestroy {

  resultHeader: string;

  layout: string = 'backslash_asset_search';

  currentView: string = 'thumbnailView';

  defaultParams: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
    app_edges_active_article: true,
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.BACKSLASH_ARTICLE_VIDEO_TYPES,
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  private subscription: Subscription = new Subscription();

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected queryParamsService: SearchQueryParamsService) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}