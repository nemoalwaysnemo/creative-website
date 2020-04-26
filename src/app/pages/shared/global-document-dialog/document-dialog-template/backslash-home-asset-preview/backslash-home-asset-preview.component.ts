import { Component } from '@angular/core';
import { AbstractDocumentDialogTemplateComponent } from '../../abstract-document-dialog-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'backslash-home-asset-dialog-preview',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './backslash-home-asset-preview.component.html',
})
export class BackslashHomeAssetDialogPreviewComponent extends AbstractDocumentDialogTemplateComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }


}
