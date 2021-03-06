import { Component } from '@angular/core';
import { GlobalSearchParams } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService, SearchFilterModel } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'disruption-home',
  styleUrls: ['./disruption-home.component.scss'],
  templateUrl: './disruption-home.component.html',
})
export class DisruptionHomeComponent extends BaseDocumentViewComponent {

  enableResourceTitle: boolean = false;

  headline: string = 'You name it.';

  extraHeadline: string = 'We\'ve disrupted it.';

  subHead: string = 'Find the who, what, where, when, why and how of our methodology.';

  assetUrlMapping: any = {
    'App-Disruption-Day': '/p/disruption/Disruption Days/day',
    'App-Disruption-Theory-Folder': '/p/disruption/Disruption How Tos/folder',
    '*': '/p/disruption/asset',
  };

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

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for roadmaps, disruption days and how-tos...',
  });

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: this.documentPageService.getConfig('path:DISRUPTION_BASE_FOLDER_PATH'),
  };

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }

  onCustomEvent(event: any): void {
    this.enableResourceTitle = event.featureEnabled;
  }

}
