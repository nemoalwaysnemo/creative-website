import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractDocumentDialogBaseTemplateComponent } from './abstract-document-dialog-base-template.component';

export abstract class AbstractDocumentDialogCustomTemplateComponent extends AbstractDocumentDialogBaseTemplateComponent {

  static readonly COMPONENT_TYPE: string = 'custom';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
