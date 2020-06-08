import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { getDocumentTypes, parseCountry } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { GLOBAL_DOCUMENT_FORM } from '../../../global-document-form';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-asset-preview',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './disruption-asset-preview.component.html',
})
export class DisruptionAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'disruption-asset-preview';

  attachments: { type: string, url: string, title: string }[] = [];

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  currentUrl: string = this.documentPageService.getCurrentFullUrl();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.attachments = this.document.getAttachmentList();
      this.writePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Write, this.getDialogSettings().enableEdit);
      this.deletePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Delete, this.getDialogSettings().enableDeletion);
      this.currentUrl = this.currentUrl.split('/disruption')[0] + '/disruption/asset/' + doc.uid;
    }
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: false,
      enableEdit: false,
      enablePreview: false,
      enableDeletion: false,
    };
  }

  getDialogTemplateName(doc: DocumentModel): string {
    let name: string = '';
    if (doc.type === 'App-Disruption-Roadmap-Asset') {
      name = GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM.NAME;
    } else if (doc.type === 'App-Disruption-Theory-Asset') {
      name = GLOBAL_DOCUMENT_FORM.DISRUPTION_HOW_TOS_ASSET_FORM.NAME;
    } else if (doc.type === 'App-Disruption-Asset') {
      name = GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM.NAME;
    }
    return name;
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }

  parseCountry(list: string[]) {
    return parseCountry(list);
  }
}
