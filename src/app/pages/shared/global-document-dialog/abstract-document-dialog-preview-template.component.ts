import { Input } from '@angular/core';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractDocumentDialogBaseTemplateComponent } from './abstract-document-dialog-base-template.component';

export abstract class AbstractDocumentDialogPreviewTemplateComponent extends AbstractDocumentDialogBaseTemplateComponent {

  @Input()
  set metadata(metadata: any) {
    if (metadata) {
      this.settings = Object.assign({}, this.settings, this.getPreviewSettings(), metadata);
    }
  }

  protected settings: any = {
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
