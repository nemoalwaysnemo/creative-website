import { Component, TemplateRef, Type } from '@angular/core';
import { DocumentModel } from '@core/api';
import { getAssetModuleType } from '@core/services/helpers';
import { DocumentModelForm } from '../../global-document-form/global-document-form.component';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentPageService } from '../../../shared/services/document-page.service';

@Component({
  selector: 'knowledge-document-asset-search-result',
  styleUrls: ['./knowledge-document-asset-search-result.component.scss'],
  templateUrl: './knowledge-document-asset-search-result.component.html',
})

export class KnowledgeDocumentAssetSearchResultComponent {

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {

  }

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  disruptionXdialogMetadata: any = {
    formMode: 'edit',
    enableEdit: false,
    moreInfo: false,
    enableThumbnailImg: true,
  };

  getDialogSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const type = this.getAssetType(doc);
    const components: Type<DocumentModelForm>[] = [];
    // 'Backslash'
    components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_BACKSLASH_ASSET);
    // 'Disruption'
    components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET);
    // 'Intelligence'
    components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_INTELLIGENCE_ASSET);
    // 'Innovation'
    components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_INNOVATION_ASSET);
    // 'Creative'
    components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_ASSET);
    // 'Business Development'
    components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET);
    components.push(GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST);
    // 'Backslash Asset'
    // components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_BACKSLASH_KNOWLEDGE_ASSET);
    // 'DisruptionX Asset'
    components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X);
    let main = null;
    let containerType = null;
    switch (type) {
      case 'Backslash':
        // if (NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE.includes(doc.type)) {
        //   main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_BACKSLASH_KNOWLEDGE_ASSET;
        // } else {
        // }
        main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_BACKSLASH_ASSET;
        break;
      case 'Backslash Report':
        main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_BACKSLASH_REPORT_ASSET;
        containerType = 'middle-dialog-container';
        break;
      case 'Disruption':
        if (this.isDisruptionX(doc)) {
          main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X;
        } else {
          main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET;
        }
        break;
      case 'Intelligence':
        main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_INTELLIGENCE_ASSET;
        break;
      case 'Innovation':
        main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_INNOVATION_ASSET;
        break;
      case 'Creative':
        main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_ASSET;
        break;
      case 'Business Development':
        main = GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET;
        break;
      default:
        break;
    }
    return new GlobalDocumentDialogSettings({ components, main, containerType});
  }

  isDisruptionX(doc: DocumentModel): boolean {
    return NUXEO_DOC_TYPE.DISRUPTION_X_TYPE.includes(doc.type);
  }

  getAssetType(doc: DocumentModel): string {
    return getAssetModuleType(doc);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  getTitle(doc: DocumentModel): string {
    let title = '';
    if (NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(doc.type)) {
      title = 'Creative';
    } else if (NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE.includes(doc.type)) {
      title = 'Backslash';
    } else if (NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE.includes(doc.type)) {
      title = 'Intelligence';
    } else if (NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE.includes(doc.type)) {
      title = 'Disruption';
    } else if (NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE.includes(doc.type)) {
      title = 'Innovation';
    } else if (NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE.includes(doc.type)) {
      title = 'Business Development';
    } else if (NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_ASSET_TYPE.includes(doc.type)) {
      title = 'Backslash Resource';
    } else if (NUXEO_DOC_TYPE.BACKSLASH_EDGE_ASSET_TYPE.includes(doc.type)) {
      title = 'Backslash Edges';
    } else if (NUXEO_DOC_TYPE.BACKSLASH_CASE_STUDIES_ASSET_TYPE.includes(doc.type)) {
      title = 'Backslash Report';
    }
    return title;
  }

  goToLink(doc: DocumentModel): void {
    this.documentPageService.goToExternalLink(doc);
  }

  getRemoteUrl(doc: DocumentModel): string {
    let url = '';
    if (NUXEO_DOC_TYPE.BACKSLASH_REMOTE_TYPE.includes(doc.type)) {
      url = '/p/backslash/remote';
    }
    return url;
  }
}
