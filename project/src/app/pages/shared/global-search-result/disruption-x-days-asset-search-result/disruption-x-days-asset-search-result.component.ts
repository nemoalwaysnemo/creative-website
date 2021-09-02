import { Component, TemplateRef } from '@angular/core';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';

@Component({
  selector: 'disruption-x-days-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-x-days-asset-search-result.component.html',
})
export class DisruptionXDaysAssetSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) { }

  title: string = 'DisruptionX Day';

  redirectUrl: string = '/p/disruption/DisruptionX/Days';

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_X_MODULE_ASSET_FORM,
      GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION,
    ],
    main: GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
  });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    moreInfo: false,
    enableThumbnailImg: true,
    enableDeletion: true,
  };

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

}
