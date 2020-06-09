import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, SearchFilterModel, NuxeoPageProviderConstants } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-project',
  templateUrl: './creative-brand-project.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandProjectComponent extends GlobalDocumentViewComponent {

  documents: DocumentModel[];

  target: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_project full-width';

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableSearchInput: false,
    enableQueryParams: true,
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
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
      timer(0).subscribe(() => { this.baseParams$.next(this.buildProjectParams(doc)); });
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

  protected buildProjectParams(doc: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_PROJECT_TYPE,
      ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
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
