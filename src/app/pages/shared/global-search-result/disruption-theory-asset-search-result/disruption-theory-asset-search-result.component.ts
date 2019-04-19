import { Component, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { PreviewDialogService } from '@pages/shared/preview-dialog';

@Component({
  selector: 'tbwa-disruption-theory-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-theory-asset-search-result.component.html',
})
export class DisruptionTheoryAssetSearchResultComponent {

  constructor(private dialogService: PreviewDialogService) { }

  open(dialog: TemplateRef<any>, doc: DocumentModel, type: string) {
    this.dialogService.open(dialog, doc);
  }

}
