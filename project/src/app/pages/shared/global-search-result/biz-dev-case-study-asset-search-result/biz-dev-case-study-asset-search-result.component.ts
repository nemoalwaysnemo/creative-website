import { Component, Input, TemplateRef } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalDocumentDialogService, GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';

@Component({
  selector: 'biz-dev-case-study-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-case-study-asset-search-result.component.html',
})
export class BizDevCaseStudyAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  @Input() showDialog: boolean = false;

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  dialogTitle: string = 'Business Development';

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET] });

  constructor(protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
