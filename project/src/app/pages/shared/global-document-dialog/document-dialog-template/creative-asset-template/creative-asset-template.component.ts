import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { getDocumentTypes, vocabularyFormatter } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { GLOBAL_DOCUMENT_FORM } from '../../../global-document-form';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-asset-template',
  styleUrls: ['../global-document-dialog-template.scss', './creative-asset-template.component.scss'],
  templateUrl: './creative-asset-template.component.html',
})
export class CreativeAssetTemplateDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'creative-asset-template';

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
    }
  }
}
