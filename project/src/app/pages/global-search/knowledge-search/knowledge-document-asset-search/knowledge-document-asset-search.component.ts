import { Component } from '@angular/core';
import { GlobalSearchFormSettings, DocumentPageService, SearchFilterModel } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'knowledge-document-asset-search',
  templateUrl: './knowledge-document-asset-search.component.html',
})
export class KnowledgeDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    currentPageIndex: 0,
    ecm_path: '/',
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    condition: ' AND ((app_global:networkshare = true AND ecm:primaryType IN ("App-Library-Image", "App-Library-Video", "App-Library-Audio") AND  ecm:path STARTSWITH "' + this.documentPageService.getConfig('path:CREATIVE_TBWA_FOLDER_PATH') + '") OR (ecm:path STARTSWITH "' + this.documentPageService.getConfig('path:KNOWEDGE_BASIC_PATH') + '" AND ecm:primaryType IN ("App-Backslash-Article", "App-Backslash-Video", "App-Intelligence-Asset", "App-Innovation-Asset", "App-BizDev-CaseStudy-Asset", "App-BizDev-Thought-Asset", "App-Disruption-Asset", "App-Disruption-Roadmap-Asset", "App-Disruption-Theory-Asset", "App-Disruption-Day-Asset", "App-Backslash-Case-Study", "App-Backslash-Edges-Asset", "App-Backslash-Resources-Asset", "App-DisruptionX-Module")))',
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_prodCredits_production_date_agg', placeholder: 'Year', filterValueFn: (bucket: any) => bucket.docCount > 0 }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({
      key: 'ecm_primaryType__in', placeholder: 'Module', options: [
        { label: 'Disruption', value: NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE },
        { label: 'Intelligence', value: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE },
        { label: 'Backslash', value: NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE },
        { label: 'Creative', value: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES },
        { label: 'Biz Dev', value: NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE },
        { label: 'Innovation', value: NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE },
      ],
    }),
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
  ];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
  }
}
