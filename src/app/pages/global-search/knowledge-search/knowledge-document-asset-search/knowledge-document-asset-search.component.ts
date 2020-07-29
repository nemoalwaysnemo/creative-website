import { Component } from '@angular/core';
import { SearchFilterModel } from '@core/api';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'knowledge-document-asset-search',
  templateUrl: './knowledge-document-asset-search.component.html',
})
export class KnowledgeDocumentAssetSearchComponent extends BaseDocumentViewComponent {

  defaultParams: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_path: '/',
    ecm_fulltext: '',
    ecm_mixinType_not_in: '',
    ecm_primaryType: NUXEO_DOC_TYPE.KNOWLEDGE_ASSET_TYPE,
  };

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_prodCredits_production_date_agg', placeholder: 'Year', filterValueFn: (bucket: any) => bucket.docCount > 0 }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({
      key: 'ecm_primaryType_predicate', placeholder: 'Module', options: [
        { label: 'Disruption', value: NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE },
        { label: 'Intelligence', value: NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE },
        { label: 'Backslash', value: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES },
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
