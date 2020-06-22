import { Component } from '@angular/core';
import { SearchFilterModel, NuxeoPageProviderParams } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-home-page',
  styleUrls: ['./creative-home-page.component.scss'],
  templateUrl: './creative-home-page.component.html',
})
export class CreativeHomePageComponent extends BaseDocumentViewComponent {

  headline: string = 'This is how we kill boring.';

  subHead: string = 'Our most disruptive work is all right here.';

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
    ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for campaigns by title, agency, brand, client...',
    autoSearch: false,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }

}
