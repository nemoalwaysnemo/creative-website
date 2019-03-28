import { Component } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-creative-recommend-brand-search',
  styleUrls: ['./creative-recommend-brand-search.component.scss'],
  templateUrl: './creative-recommend-brand-search.component.html',
})
export class CreativeRecommendBrandSearchComponent {

  baseParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  filters: any = {
    'the_loupe_main_assettype_agg': { placeholder: 'Asset Type' },
    'the_loupe_main_agency_agg': { placeholder: 'Agency' },
    'the_loupe_main_country_agg': { placeholder: 'County' },
    'the_loupe_main_brand_agg': { placeholder: 'Brand' },
    'the_loupe_main_clientName_agg': { placeholder: 'Client' },
    'app_edges_industry_agg': { placeholder: 'Industry' },
    'the_loupe_main_campaign_agg': { placeholder: 'Campaign' },
    'app_edges_backslash_category_agg': { placeholder: 'Category' },
    'app_edges_tags_edges_agg': { placeholder: 'Edges' },
  };
}
