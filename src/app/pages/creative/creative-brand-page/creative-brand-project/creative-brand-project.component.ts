import { Component } from '@angular/core';
import { AdvanceSearch, DocumentModel, SearchFilterModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { SearchQueryParamsService, AbstractDocumentViewComponent } from '@pages/shared';
import { Subject } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-brand-project',
  templateUrl: './creative-brand-project.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandProjectComponent extends AbstractDocumentViewComponent {

  documents: DocumentModel[];

  target: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_project full-width';

  filters: SearchFilterModel[] = [];

  showInput: boolean = false;

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
    this.document = doc; // brand
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
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_PROJECT_TYPE,
      ecm_mixinType: '["HiddenInNavigation"]',
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
