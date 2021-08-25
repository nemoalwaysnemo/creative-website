import { Component, Input, TemplateRef } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalDocumentDialogService, GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../../../shared/global-document-dialog';

@Component({
  selector: 'biz-dev-opportunity-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-opportunity-asset-search-result.component.html',
})
export class BizDevOpportunityAssetSearchResultComponent extends BaseSearchResultComponent {

  constructor(protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_BIZDEV_ASSET] });

  dialogTitle: string = 'Business Development';

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
