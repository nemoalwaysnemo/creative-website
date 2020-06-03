import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, AdvanceSearchService, SearchFilterModel } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-usage-rights',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-brand-usage-rights.component.html',
})
export class CreativeBrandUsageRightsComponent extends GlobalDocumentViewComponent {

  documents: DocumentModel[];

  target: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative-brand-usage-rights full-width';

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableSearchInput: false,
    enableQueryParams: true,
  });

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService) {
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
    super.setCurrentDocument(doc); // brand
    if (doc) {
      this.baseParams$.next(this.buildContractParams(doc));
      this.getTargetDocumentModel({
        pageSize: 1,
        currentPageIndex: 0,
        ecm_path: doc.path,
        ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_FOLDER_TYPE,
      }).subscribe((target: DocumentModel) => {
        this.target = target;
        this.target.setParent(doc);
      });
    }
  }

  protected buildContractParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_CONTRACT_TYPES,
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
