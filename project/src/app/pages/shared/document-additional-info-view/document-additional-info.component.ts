import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes } from '@core/services/helpers';
import { DocumentPageService } from '../services/document-page.service';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../global-document-dialog';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-additional-info',
  styleUrls: ['./document-additional-info.component.scss'],
  templateUrl: './document-additional-info.component.html',
})
export class DocumentAdditionalInfoComponent implements OnInit {

  documentModel: DocumentModel;

  downloadPermission$: Observable<boolean> = observableOf(false);

  docType: string;

  attachments: { type: any; url: any; title: any }[] = [];

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST] });

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.performDocument(doc);
    }
  }

  constructor(
    private documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit(): void {

  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = '', title: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type, title);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  isNeedSendDownloadRequest(doc: DocumentModel): boolean {
    return this.isBizDevCaseStudyAsset(doc) && doc.get('app_global:asset_request') === true;
  }

  private isBizDevCaseStudyAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_ASSET_TYPE).includes(doc.type);
  }

  private performDocument(doc: DocumentModel): void {
    if (this.isBizDevCaseStudyAsset(doc)) {
      this.downloadPermission$ = observableOf(doc.get('app_global:asset_request') === false);
    } else {
      this.downloadPermission$ = observableOf(true);
    }
    if (NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE.includes(doc.type)) {
      this.docType = 'Disruption';
      this.attachments = doc.getAttachmentList();
    } else if (NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE.includes(doc.type)) {
      this.docType = 'Business-Development';
      this.attachments = doc.getAttachmentList();
    } else if (NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(doc.type)) {
      this.docType = 'Creative';
    } else if (NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE.includes(doc.type)) {
      this.docType = 'Innovation';
      this.attachments = doc.getAttachmentList();
    } else if (NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE.includes(doc.type)) {
      this.docType = 'Backslash';
      this.attachments = doc.getAttachmentList();
    }
  }
}
