import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { vocabularyFormatter } from '@core/services/helpers';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'innovation-asset-preview-dialog',
  styleUrls: ['./innovation-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './innovation-asset-preview-dialog.component.html',
})
export class InnovationAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  attachments: { type: string; url: string; title: string }[] = [];

  viewerSettings: any = {
  };

  hideDialogInfo: boolean = false;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    this.documentPageService.onEventType('knowledge-inner-dialog').subscribe((e: GlobalEvent) => {
      if (e.name === 'Opened') {
        this.hideDialogInfo = true;
      } else {
        this.hideDialogInfo = false;
      }
    });
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.attachments = this.document.getAttachmentList();
      this.shareUrl = this.buildShareUrl(doc);
    }
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    let url: string;
    if (doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'NEXT')) {
      url = 'innovation/NEXT/folder/';
    } else if (doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'Things to Steal')) {
      url = 'innovation/Things to Steal/folder/';
    }
    if (doc.type === 'App-Innovation-Asset') {
      url = url + ':parentRef/asset/';
    }
    return this.documentPageService.getCurrentAppUrl(url.replace(':parentRef', doc.parentRef) + doc.uid);
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: false,
      enablePreview: false,
      enableDetail: false,
      enableKnowledgeRelated: false,
    };
  }

}
