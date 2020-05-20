import { Component, TemplateRef } from '@angular/core';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

@Component({
  selector: 'disruption-thinking-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-thinking-asset-search-result.component.html',
})
export class DisruptionThinkingAssetSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  title: string = 'Things to Steal';

  redirectUrl: string = '/p/disruption/Things to Steal';

  previewComponent: any = GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET;

  formComponent: any = GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM;

  customComponent: any = GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION;

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: true,
    moreInfo: true,
    enablePreview: true,
  };

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

}
