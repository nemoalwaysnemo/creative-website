import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { getDocumentTypes, vocabularyFormatter } from '@core/services/helpers';
import { DocumentPageService } from '../../services/document-page.service';
import { DocumentPreviewInDialogBaseTemplateComponent } from '../document-preview-in-dialog-base-template.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-asset-preview-in-dialog',
  styleUrls: ['../../global-document-dialog/document-dialog-template/global-document-dialog-template.scss', './disruption-asset-preview-in-dialog.component.scss'],
  templateUrl: './disruption-asset-preview-in-dialog.component.html',
})
export class DisruptionAssetPreviewInDialogComponent extends DocumentPreviewInDialogBaseTemplateComponent {

  attachments: { type: string, url: string, title: string }[] = [];

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
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
      moreInfo: false,
      enableEdit: false,
      enablePreview: false,
      enableDeletion: false,
      enableDetail: false,
      enableKnowledgeRelated: false,
    };
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  isDisruptionRoadmapAsset(doc: DocumentModel): boolean {
    return this.isDisruptionAsset(doc) && getDocumentTypes(NUXEO_DOC_TYPE.DISRUPTION_ROADMAP_TYPE).includes(doc.type);
  }

  private buildShareUrl(doc: DocumentModel): string {
    if (this.isIntelligenceAsset(doc)) {
      return this.documentPageService.getCurrentAppUrl('intelligence/asset/' + doc.uid);
    } else if (this.isDisruptionAsset(doc)) {
      let url: string;
      if (doc.path.includes(NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH)) {
        url = 'disruption/Disruption Days/day/:parentRef/asset/';
      } else if (doc.path.includes(NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH)) {
        url = 'disruption/Disruption How Tos/folder/:parentRef/asset/';
      } else {
        url = 'disruption/asset/';
      }
      return this.documentPageService.getCurrentAppUrl(url.replace(':parentRef', doc.parentRef) + doc.uid);
    }
    return this.shareUrl;
  }
}
