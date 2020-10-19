import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoSearchConstants, NuxeoRequestOptions } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-project-3rd-party-import',
  templateUrl: './creative-brand-project-3rd-party-import.component.html',
  styleUrls: ['../../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandProject3rdPartyImportComponent extends GlobalDocumentViewComponent {

  layout: string = 'creative_brand_asset full-width';

  requestDocument: DocumentModel;

  loadingRequest: boolean = true;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.getRequestDocument(doc);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_PROJECT_TYPE,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
    };
  }

  private getRequestDocument(doc: DocumentModel): void {
    const requestUid = this.activatedRoute.snapshot.paramMap.get('request');
    if (requestUid) {
      const options = new NuxeoRequestOptions();
      options.addSchemas('The_Loupe_Delivery');
      this.getTargetDocumentModel({
        pageSize: 1,
        ecm_path: doc.path,
        ecm_uuid: requestUid,
        ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMPORT_REQUEST_TYPE,
      }, options).subscribe((request: DocumentModel) => {
        this.loadingRequest = false;
        this.requestDocument = request;
      });
    } else {
      this.documentPageService.redirectTo404();
    }
  }

}
