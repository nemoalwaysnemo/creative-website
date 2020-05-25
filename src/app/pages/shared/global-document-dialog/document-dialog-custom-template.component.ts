import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { DocumentDialogBaseTemplateComponent } from './document-dialog-base-template.component';

@Component({
  template: '',
})
export class DocumentDialogCustomTemplateComponent extends DocumentDialogBaseTemplateComponent {

  static readonly COMPONENT_TYPE: string = 'custom';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
