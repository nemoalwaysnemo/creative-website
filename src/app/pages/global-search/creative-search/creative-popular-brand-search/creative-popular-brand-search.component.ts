import { Component } from '@angular/core';
import { NUXEO_META_INFO, NUXEO_PATH_INFO } from '@environment/environment';
import { SearchFilterModel } from '@core/api';

@Component({
  selector: 'creative-popular-brand-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-popular-brand-search.component.html',
})
export class CreativePopularBrandSearchComponent {

  layout: string = 'popular_brand_search full-width';

  defaultParams: any = {
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_SELECTED_BRAND_TYPE,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  filters: SearchFilterModel[] = [
    // new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    // new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    // new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    // new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    // new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', convertTitle: true }),
    // new SearchFilterModel({ key: 'app_global_networkshare_agg', placeholder: 'Showcase', optionLabels: { 'true': 'Yes', 'false': 'No' } }),
  ];

  currentView: string = 'thumbnailView';

  onResultViewChange(name: string): void {
    this.currentView = name;
  }

}
