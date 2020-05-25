import { Component } from '@angular/core';
import { AdvanceSearch, DocumentModel, SearchFilterModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { SearchQueryParamsService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { Subject } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-brand-campaign-summary',
  templateUrl: './creative-brand-campaign-summary.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandCampaignSummaryComponent extends GlobalDocumentViewComponent {

  documents: DocumentModel[];

  target: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_campaign full-width';

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings();

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_BRAND_FOLDER_TYPE,
    };
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.baseParams$.next(this.buildCampaignParams(doc));
      this.getTargetDocumentModel({
        pageSize: 1,
        currentPageIndex: 0,
        ecm_path: doc.path,
        ecm_primaryType: NUXEO_META_INFO.CREATIVE_CAMPAIGN_FOLDER_TYPE,
      }).subscribe((target: DocumentModel) => {
        this.target = target;
        this.target.setParent(doc);
      });
    }
  }

  protected buildCampaignParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_CAMPAIGN_TYPE,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }

}
