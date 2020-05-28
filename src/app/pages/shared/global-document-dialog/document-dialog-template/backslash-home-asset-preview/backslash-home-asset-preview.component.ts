import { Component } from '@angular/core';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'backslash-home-asset-dialog-preview',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './backslash-home-asset-preview.component.html',
})
export class BackslashHomeAssetDialogPreviewComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'backslash-home-asset-preview';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
