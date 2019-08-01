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
      this.attachments = this.document.getAttachmentList();
    } else if (NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(this.document.type)) {
      this.docType = 'Creative';
    }
  }
}
