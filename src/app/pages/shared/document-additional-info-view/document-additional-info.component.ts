import { Component, Input, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'document-additional-info',
  styleUrls: ['./document-additional-info.component.scss'],
  templateUrl: './document-additional-info.component.html',
})
export class DocumentAdditionalInfoComponent implements OnInit {

  @Input() document: DocumentModel;

  docType: string;

  attachments: { type: any, url: any, title: any }[] = [];

  ngOnInit() {
    if (NUXEO_META_INFO.DISRUPTION_ASSET_TYPE.includes(this.document.type)) {
      this.docType = 'Disruption';
      this.buildAttachmentList();
    } else if (NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE.includes(this.document.type)) {
      this.docType = 'Intelligence';
    } else {
      this.docType = 'Creative';
    }
  }

  isDisruptionAsset() {
    return NUXEO_META_INFO.DISRUPTION_ASSET_TYPE.includes(this.document.type);
  }

  private buildAttachmentList() {
    const attachmentList = [];
    if (this.document.get('files:files').length > 0) {
      this.document.get('files:files').forEach((entry) => {
        attachmentList.push({ type: entry.file['mime-type'], url: entry.file.data, title: entry.file.name });
      });
    }
    this.attachments = attachmentList;
  }
}
