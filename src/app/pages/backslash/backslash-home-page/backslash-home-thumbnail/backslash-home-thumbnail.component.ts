import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'backslash-home-thumbnail',
  styleUrls: ['./backslash-home-thumbnail.component.scss'],
  templateUrl: './backslash-home-thumbnail.component.html',
})
export class BackslashHomeThumbnailComponent {

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

}
