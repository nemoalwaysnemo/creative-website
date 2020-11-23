import { Component, TemplateRef } from '@angular/core';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../../global-document-form';

@Component({
  selector: 'disruption-x-module-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-x-module-asset-search-result.component.html',
})
export class DisruptionXModuleAssetSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  title: string = 'DisruptionX';

  redirectUrl: string = '/p/disruption/DisruptionX';

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_X_MODULE_ASSET_FORM,
    ],
    main: GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET,
  });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    moreInfo: true,
  };

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

}
