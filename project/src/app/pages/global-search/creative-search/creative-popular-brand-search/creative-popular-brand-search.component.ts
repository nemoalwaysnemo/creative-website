import { Component } from '@angular/core';
import { GlobalSearchFormSettings, DocumentPageService, SearchFilterModel } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-popular-brand-search',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-popular-brand-search.component.html',
})
export class CreativePopularBrandSearchComponent extends BaseDocumentViewComponent {

  layout: string = 'popular_brand_search full-width';

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_SELECTED_BRAND_TYPE,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  filters: SearchFilterModel[] = [
    // new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    // new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    // new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    // new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    // new SearchFilterModel({ key: 'the_loupe_main_campaign_agg', placeholder: 'Campaign', visibleFn: (searchParams: GlobalSearchParams): boolean => searchParams.hasFilter('the_loupe_main_agency_agg') }),
    // new SearchFilterModel({ key: 'app_global_networkshare_agg', placeholder: 'Showcase', optionLabels: { 'true': 'Yes', 'false': 'No' } }),
  ];

  currentView: string = 'thumbnailView';

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  onResultViewChanged(name: string): void {
    this.currentView = name;
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }
}
