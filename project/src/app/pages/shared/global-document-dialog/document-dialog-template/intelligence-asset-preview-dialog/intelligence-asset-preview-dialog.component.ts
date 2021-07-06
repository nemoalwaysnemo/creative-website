import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { vocabularyFormatter } from '@core/services/helpers';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'intelligence-asset-preview-dialog',
  styleUrls: ['./intelligence-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './intelligence-asset-preview-dialog.component.html',
})
export class IntelligenceAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'intelligence-asset-preview';

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  attachments: { type: string, url: string, title: string }[] = [];

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
      this.shareUrl = this.buildShareUrl(doc);
      this.attachments = this.document.getAttachmentList();
    }
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl('intelligence/asset/' + doc.uid);
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
