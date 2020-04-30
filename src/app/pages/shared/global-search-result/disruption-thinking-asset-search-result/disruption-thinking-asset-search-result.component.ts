import { Component, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
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

  title: string = 'Brilliant Thinking';

  previewComponent: any = GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET;

  formComponent: any = GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM;

  generalComponent: any = GLOBAL_DOCUMENT_DIALOG.GENERAL_DELETION;

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: true,
    moreInfo: true,
    enablePreview: true,
  };

  openDialog(dialog: TemplateRef<any>) {
    this.globalDocumentDialogService.open(dialog);
  }

}
