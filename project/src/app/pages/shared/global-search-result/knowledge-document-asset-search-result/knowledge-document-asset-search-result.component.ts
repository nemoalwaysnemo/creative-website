import { Component, TemplateRef, Type } from '@angular/core';
import { DocumentModel } from '@core/api';
import { getAssetModuleType } from '@core/services/helpers';
import { DocumentModelForm } from '../../global-document-form/global-document-form.component';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'knowledge-document-asset-search-result',
  styleUrls: ['./knowledge-document-asset-search-result.component.scss'],
  templateUrl: './knowledge-document-asset-search-result.component.html',
})

export class KnowledgeDocumentAssetSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) { }

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  getDialogSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'Backslash':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREIVEW_BACKSLASH_HOME_ASSET);
        break;
      case 'Disruption':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET);
        break;
      case 'Intelligence':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_INTELLIGENCE_ASSET);
        break;
      case 'Innovation':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_INNOVATION_ASSET);
        break;
      case 'Creative':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_ASSET);
        break;
      case 'Business Development':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET);
        components.push(GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST);
        break;
      default:
        break;
    }
    return new GlobalDocumentDialogSettings({ components });
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
    } else if (NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES.includes(doc.type)) {
      title = 'Backslash';
    } else if (NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE.includes(doc.type)) {
      title = 'Intelligence';
    } else if (NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE.includes(doc.type)) {
      title = 'Disruption';
    } else if (NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE.includes(doc.type)) {
      title = 'Innovation';
    } else if (NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE.includes(doc.type)) {
      title = 'Business Development';
    }
    return title;
  }
}
