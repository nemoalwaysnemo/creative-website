import { Component } from '@angular/core';
import { AdvanceSearchService, DocumentModel, SearchFilterModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { Subject } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-campaign',
  templateUrl: './creative-brand-campaign.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandCampaignComponent extends GlobalDocumentViewComponent {

  documents: DocumentModel[];

  target: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_campaign full-width';

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableSearchInput: false,
    enableQueryParams: true,
  });

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(advanceSearchService, activatedRoute, documentPageService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_BRAND_FOLDER_TYPE,
    };
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.baseParams$.next(this.buildCampaignParams(doc));
      this.getTargetDocumentModel({
        pageSize: 1,
        currentPageIndex: 0,
        ecm_path: doc.path,
        ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_CAMPAIGN_FOLDER_TYPE,
      }).subscribe((target: DocumentModel) => {
        this.target = target;
        this.target.setParent(doc);
      });
    }
  }

  protected buildCampaignParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_CAMPAIGN_TYPE,
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
