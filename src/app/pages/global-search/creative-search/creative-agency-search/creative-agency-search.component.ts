import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { SearchFilterModel } from '@core/api';

@Component({
  selector: 'creative-agency-search',
  styleUrls: ['./creative-agency-search.component.scss'],
  templateUrl: './creative-agency-search.component.html',
})
export class CreativeAgencySearchComponent {

  defaultParams: any = {
    the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_FOLDER_TYPE,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
    currentPageIndex: 0,
    pageSize: 20,
    ecm_path: '',
    ecm_fulltext: '',
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    // new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    // new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    // new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: NuxeoPageProviderParams): boolean => searchParams.hasFilter('the_loupe_main_agency_agg') }),
    // new SearchFilterModel({ key: 'app_global_networkshare_agg', placeholder: 'Showcase', optionLabels: { 'true': 'Yes', 'false': 'No' } }),
  ];

  currentView: string = 'thumbnailView';

}