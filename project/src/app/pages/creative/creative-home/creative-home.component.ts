import { Component } from '@angular/core';
import { GlobalSearchParams } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService, SearchFilterModel } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-home',
  styleUrls: ['./creative-home.component.scss'],
  templateUrl: './creative-home.component.html',
})
export class CreativeHomeComponent extends BaseDocumentViewComponent {

  headline: string = 'This is how we kill boring.';

  subHead: string = 'Our most disruptive work is all right here.';

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: GlobalSearchParams): boolean => searchParams.hasParam('the_loupe_main_brand_agg') || searchParams.hasParam('the_loupe_main_campaign_agg') }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for campaigns by title, agency, brand, client...',
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }

}
