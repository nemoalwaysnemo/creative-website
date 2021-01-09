import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { vocabularyFormatter } from '@core/services/helpers';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'backslash-knowledge-asset-preview-dialog',
  templateUrl: './backslash-knowledge-asset-preview-dialog.component.html',
  styleUrls: ['./backslash-knowledge-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
})
export class BackslashKnowledgeAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'backslash-knowledge-asset-preview';

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  attachments: { type: string, url: string, title: string }[] = [];

  viewerSettings: any = {
    layout: this.getDialogSettings().docViewerLayout,
  };

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

  buildShareUrl(doc: DocumentModel): string {
    let url: string;
    if (doc.path.includes(NUXEO_PATH_INFO.BACKSLASH_CASE_STUDIES_FOLDER_PATH)) {
      url = 'backslash/report/folder/:parentRef/asset/';
    } else if (doc.path.includes(NUXEO_PATH_INFO.BACKSLASH_EDGE_FOLDER_PATH)) {
      url = 'backslash/edge/folder/:parentRef/asset/';
    } else if (doc.path.includes(NUXEO_PATH_INFO.BACKSLASH_RESOURCES_FOLDER_PATH)) {
      url = 'backslash/resource/folder/:parentRef/asset/';
    }
    return this.documentPageService.getCurrentAppUrl(url.replace(':parentRef', doc.parentRef) + doc.uid);
  }
}
