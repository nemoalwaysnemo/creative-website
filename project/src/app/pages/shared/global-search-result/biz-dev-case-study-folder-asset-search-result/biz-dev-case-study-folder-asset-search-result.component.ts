import { Component, Input, TemplateRef } from '@angular/core';
import { GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService } from '../../../shared/global-document-dialog';
import { DocumentPageService } from '../../../shared/services/document-page.service';
import { BaseSearchResultComponent } from '../base-search-result.component';

@Component({
  selector: 'biz-dev-case-study-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-case-study-folder-asset-search-result.component.html',
})
export class BizDevCaseStudyFolderAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

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

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET,
      GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST,
    ],
  });

  dialogTitle: string = 'Business Development';

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

}
