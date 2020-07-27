import { Component, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { parseCountry, getDocumentTypes } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'bizdev-asset-preview-dialog',
  styleUrls: ['./bizdev-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './bizdev-asset-preview-dialog.component.html',
})
export class BizdevAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  downloadPermission$: Observable<boolean> = observableOf(false);

  attachments: { type: string, url: string, title: string }[] = [];

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.shareUrl = this.buildShareUrl(doc);
      this.attachments = doc.getAttachmentList();
      if (this.isBizDevCaseStudyAsset(doc)) {
        this.downloadPermission$ = observableOf(doc.get('app_global:asset_request') === false);
      } else {
        this.downloadPermission$ = observableOf(true);
      }
    }
  }

  parseCountry(list: string[]): string {
    return parseCountry(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    let url: string;
    if (doc.type === 'App-BizDev-CaseStudy-Asset') {
      url = 'business-development/Case Studies/folder/:parentRef/asset/';
    } else if (doc.type === 'App-BizDev-Thought-Asset') {
      url = 'business-development/Thought Leadership/folder/:parentRef/asset/';
    }
    return this.documentPageService.getCurrentAppUrl(url.replace(':parentRef', doc.parentRef) + doc.uid);
  }

  isNeedSendDownloadRequest(doc: DocumentModel): boolean {
    return this.isBizDevCaseStudyAsset(doc) && doc.get('app_global:asset_request') === true;
  }

  isBizDevCaseStudyAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_ASSET_TYPE).includes(doc.type);
  }
}
