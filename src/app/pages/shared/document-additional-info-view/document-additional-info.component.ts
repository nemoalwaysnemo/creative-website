import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { getDocumentTypes } from '@core/services/helpers';
import { GLOBAL_DOCUMENT_DIALOG } from '../global-document-dialog';


@Component({
  selector: 'document-additional-info',
  styleUrls: ['./document-additional-info.component.scss'],
  templateUrl: './document-additional-info.component.html',
})
export class DocumentAdditionalInfoComponent implements OnInit {

  @Input() document: DocumentModel;

  docType: string;

  attachments: { type: any, url: any, title: any }[] = [];

  generalComponent: any = GLOBAL_DOCUMENT_DIALOG.GENERAL_DOWNLOAD_REQUEST;

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit() {
    if (NUXEO_META_INFO.DISRUPTION_ASSET_TYPE.includes(this.document.type)) {
      this.docType = 'Disruption';
      this.attachments = this.document.getAttachmentList();
    } else if (NUXEO_META_INFO.BIZ_DEV_ASSET_TYPE.includes(this.document.type)) {
      this.docType = 'Business-Development';
      this.attachments = this.document.getAttachmentList();
    } else if (NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(this.document.type)) {
      this.docType = 'Creative';
    }
  }

  private openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  private isNeedSendDownloadRequest(doc: DocumentModel): boolean {
    return this.isBizDevCaseStudyAsset(doc) && doc.get('app_global:asset_request') === true;
  }

  private isBizDevCaseStudyAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_ASSET_TYPE).includes(doc.type);
  }
}
