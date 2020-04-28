import { Component, ComponentFactoryResolver } from '@angular/core';
import { AbstractDocumentDialogContainerComponent } from '../abstract-document-dialog-container.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { SearchQueryParamsService } from '../../services/search-query-params.service';

@Component({
  selector: 'document-dialog-preview',
  styleUrls: ['./document-dialog-preview.component.scss'],
  templateUrl: './document-dialog-preview.component.html',
})
export class DocumentDialogPreviewComponent extends AbstractDocumentDialogContainerComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, queryParamsService, componentFactoryResolver);
  }

}
