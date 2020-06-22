import { Component } from '@angular/core';
import { NuxeoPagination, DocumentModel, NuxeoPageProviderParams, SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { TAB_CONFIG } from '../disruption-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-home',
  styleUrls: ['./disruption-home.component.scss'],
  templateUrl: './disruption-home.component.html',
})
export class DisruptionHomeComponent extends BaseDocumentViewComponent {

  tabs: any[] = TAB_CONFIG;

  loading: boolean = true;

  headline: string = 'You name it.';

  extraHeadline: string = 'We\'ve disrupted it.';

  subHead: string = 'Find the who, what, where, when, why and how of our methodology.';

  assetUrlMapping: object = {
    'App-Disruption-Day': '/p/disruption/Disruption Days/day',
    'App-Disruption-Theory-Folder': '/p/disruption/Disruption How Tos/folder',
    '*': '/p/disruption/asset',
  };

  folders: any[];

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

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search for roadmaps, disruption days and how-tos...',
    autoSearch: false,
  });

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_BASE_FOLDER_PATH,
  };

  private folderParams: any = {
    pageSize: 50,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_FOLDER_TYPE,
  };

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.search(this.folderParams);
  }

  private search(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.folders = res.entries.filter((doc: DocumentModel) => this.tabs.some(x => doc.title === x.title));
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

}
