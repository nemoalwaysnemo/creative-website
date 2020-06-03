import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE, Environment } from '@environment/environment';

@Component({
  selector: 'backslash-home-thumbnail',
  styleUrls: ['./backslash-home-thumbnail.component.scss'],
  templateUrl: './backslash-home-thumbnail.component.html',
})
export class BackslashHomeThumbnailComponent {
  layout: string = 's-results my_agency dates full-width backslash_asset_search';

  currentView: string = 'thumbnailView';

  oldBackslashUrl = Environment.backslashAppUrl;

  defaultParams: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
    app_edges_active_article: true,
    ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES,
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_backslash_type', placeholder: 'Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_relevant_country', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Agency Country', iteration: true }),
  ];

}
