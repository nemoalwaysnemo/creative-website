import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-agency-search',
  styleUrls: ['./creative-agency-search.component.scss'],
  templateUrl: './creative-agency-search.component.html',
})
export class CreativeAgencySearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_AGENCY_FOLDER_TYPE,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
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

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument(null);
  }
}
