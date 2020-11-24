import { Component, TemplateRef } from '@angular/core';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';

@Component({
  selector: 'disruption-x-module-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-x-module-asset-search-result.component.html',
})
export class DisruptionXModuleAssetSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) {}

  title: string = 'DisruptionX';

  redirectUrl: string = '/p/disruption/DisruptionX';

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_X_MODULE_ASSET_FORM,
    ],
    main: GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
  });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    moreInfo: false,
    enableThumbnailImg: true,
  };

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

}
