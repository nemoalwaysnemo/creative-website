import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { getDocumentTypes } from '@core/services/helpers';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService } from '../../../shared/global-document-dialog';
import { DocumentPageService } from '../../../shared/services/document-page.service';
import { BaseSearchResultComponent } from '../base-search-result.component';

@Component({
  selector: 'biz-dev-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-document-asset-search-result.component.html',
})
export class BizDevDocumentAssetSearchResultComponent extends BaseSearchResultComponent {

  private assetUrlMapping: any = {
    'App-BizDev-CaseStudy-Folder': '/p/business-development/Case Studies/folder',
    'App-BizDev-Thought-Folder': '/p/business-development/Thought Leadership/folder',
    '*': '/p/business-development/asset',
  };

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  @Input() showDialog: boolean = false;

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET] });

  dialogTitle: string = 'Business Development';

  isBusinessFolder(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_CASE_THOUGHT_FOLDER).includes(doc.type);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  getAssetUrl(doc: DocumentModel): string {
    if (doc.type === 'App-BizDev-CaseStudy-Asset') {
      return `/p/business-development/Case Studies/folder/${doc.parentRef}/asset/`;
    } else if (doc.type === 'App-BizDev-Thought-Asset') {
      return `/p/business-development/Thought Leadership/folder/${doc.parentRef}/asset/`;
    } else {
      return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
    }
  }

}
