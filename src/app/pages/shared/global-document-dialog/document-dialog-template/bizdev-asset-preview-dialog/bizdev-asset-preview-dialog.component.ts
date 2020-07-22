import { Component, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { parseCountry, getDocumentTypes } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentPageService } from '../../../services/document-page.service';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings, GlobalDocumentDialogService } from '../../../global-document-dialog';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'bizdev-asset-preview-dialog',
  styleUrls: ['./bizdev-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './bizdev-asset-preview-dialog.component.html',
})
export class BizdevAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  currentUrl: string = this.documentPageService.getCurrentFullUrl();

  downloadPermission$: Observable<boolean> = observableOf(false);

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST] });

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.currentUrl = this.buildShareUrl(doc);
      if (this.isBizDevCaseStudyAsset(doc)) {
        this.downloadPermission$ = observableOf(doc.get('app_global:asset_request') === false);
      } else {
        this.downloadPermission$ = observableOf(true);
      }
    }
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  parseCountry(list: string[]): string {
    return parseCountry(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    let url: string = this.currentUrl.split('/p/')[0];
    url += '/p/business-development/asset/' + doc.uid;
    return url;
  }

  isNeedSendDownloadRequest(doc: DocumentModel): boolean {
    return this.isBizDevCaseStudyAsset(doc) && doc.get('app_global:asset_request') === true;
  }

  isBizDevCaseStudyAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_ASSET_TYPE).includes(doc.type);
  }
}
