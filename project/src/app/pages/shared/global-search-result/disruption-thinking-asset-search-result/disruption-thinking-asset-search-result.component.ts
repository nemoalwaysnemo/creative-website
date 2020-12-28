import { Component, TemplateRef } from '@angular/core';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../../global-document-form';

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

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM,
      GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION,
    ],
    main: GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET,
  });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: true,
    moreInfo: true,
    enablePreview: true,
  };

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

}
