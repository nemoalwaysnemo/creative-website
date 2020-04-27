import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractDocumentDialogBaseTemplateComponent } from './abstract-document-dialog-base-template.component';

export abstract class AbstractDocumentDialogPreviewTemplateComponent extends AbstractDocumentDialogBaseTemplateComponent {

  protected settings: any = {
    docViewerLayout: 'dialogSlides',
  };

  protected previewSettings: any;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  getSettings(): any {
    if (!this.previewSettings) {
      this.previewSettings = Object.assign({}, this.settings, this.getPreviewSettings());
    }
    return this.previewSettings;
  }

  protected getPreviewSettings(): any {
    return {};
  }

}
