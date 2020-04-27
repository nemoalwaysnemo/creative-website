import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { SearchQueryParamsService } from '../../../services/search-query-params.service';
import { AbstractDocumentDialogPreviewTemplateComponent } from '../../abstract-document-dialog-preview-template.component';

@Component({
  selector: 'related-backslash-asset-preview',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './related-backslash-asset-preview.component.html',
})
export class RelatedBackslashAssetDialogPreviewComponent extends AbstractDocumentDialogPreviewTemplateComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  previewBtnImage(): string {
    return this.assetPath('assets/images/preview_logo.png');
  }

}
