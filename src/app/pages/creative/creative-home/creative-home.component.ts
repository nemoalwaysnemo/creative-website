import { Component } from '@angular/core';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-home-page',
  styleUrls: ['./creative-home.component.scss'],
  templateUrl: './creative-home.component.html',
})
export class CreativeHomeComponent {

  headline: string = 'This is how we kill boring.';

  subHead: string = 'Our entire collection of disruptive work is all right here.';

  placeholder: string = 'Search for campaigns by title, agency, brand, client...';

  filters: any = {
    'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'the_loupe_main_country_agg': { placeholder: 'County', iteration: true },
    'the_loupe_main_assettype_agg': { placeholder: 'Asset Type' },
    'the_loupe_main_clientName_agg': { placeholder: 'Client' },
    'app_edges_industry_agg': { placeholder: 'Industry', iteration: true },
    'app_edges_backslash_category_agg': { placeholder: 'Category' },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };

  defaultParams: any = {
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH + 'TBWA-',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

}
