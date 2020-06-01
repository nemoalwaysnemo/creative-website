import { Component, TemplateRef } from '@angular/core';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../../global-document-form';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { GlobalDocumentDialogSettings } from '../../global-document-dialog/global-document-dialog.interface';

@Component({
  selector: 'disruption-roadmaps-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-roadmaps-asset-search-result.component.html',
})
export class DisruptionRoadmapsAssetSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  title: string = 'Disruption Roadmaps';

  redirectUrl: string = '/p/disruption/Disruption Roadmaps';

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM,
      GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION,
    ],
    current: GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET,
  });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: true,
    moreInfo: true,
  };

  openDialog(dialog: TemplateRef<any>) {
    this.globalDocumentDialogService.open(dialog);
  }

}
