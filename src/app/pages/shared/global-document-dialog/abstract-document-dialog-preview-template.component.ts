import { Input } from '@angular/core';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractDocumentDialogCustomTemplateComponent } from './abstract-document-dialog-custom-template.component';

export abstract class AbstractDocumentDialogPreviewTemplateComponent extends AbstractDocumentDialogCustomTemplateComponent {

  @Input()
  set metadata(metadata: any) {
    if (metadata) {
      this.dialogSettings = Object.assign({}, this.dialogSettings, this.getPreviewSettings(), metadata);
    }
  }

  protected dialogSettings: any = {
    docViewerLayout: 'dialogSlides',
  };

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  protected getPreviewSettings(): any {
    return {};
  }

}
