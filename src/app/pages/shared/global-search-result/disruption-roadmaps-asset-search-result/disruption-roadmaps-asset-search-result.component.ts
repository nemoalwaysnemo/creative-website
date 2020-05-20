import { Component, TemplateRef } from '@angular/core';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

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

  previewComponent: any = GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET;

  formComponent: any = GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM;

  customComponent: any = GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION;

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: true,
  };

  openDialog(dialog: TemplateRef<any>) {
    this.globalDocumentDialogService.open(dialog);
  }

}
