import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { matchAssetUrl, vocabularyFormatter } from '@core/services/helpers';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'backslash-knowledge-asset-preview-dialog',
  templateUrl: './backslash-knowledge-asset-preview-dialog.component.html',
  styleUrls: ['./backslash-knowledge-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
})
export class BackslashKnowledgeAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'backslash-knowledge-asset-preview';

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  attachments: { type: string; url: string; title: string }[] = [];

  viewerSettings: any = {
    layout: this.getDialogSettings().docViewerLayout,
  };

  hideDialogInfo: boolean = false;

  private assetUrlMapping: any = {
    'App-Backslash-Edges-Asset': 'backslash/resource/edge/:parentRef/asset/',
    'App-Backslash-Case-Study': 'backslash/report/folder/:parentRef/asset/',
    'App-Backslash-Resources-Asset': 'backslash/resource/folder/:parentRef/asset/',
    'App-Edges-Trigger': 'backslash/Trigger Pool/asset/',
    '*': 'backslash/asset/',
  };

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

  protected getPreviewSettings(): any {
    return {
      moreInfo: true,
      enablePreview: true,
      enableDetail: true,
      enableKnowledgeRelated: false,
    };
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  private buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl(matchAssetUrl(doc, this.assetUrlMapping) + doc.uid);
  }
}
