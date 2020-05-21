import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { AbstractDocumentDialogContainerComponent } from '../abstract-document-dialog-container.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { DocumentModelForm } from '../../global-document-form/abstract-document-form.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { DocumentFormEvent } from '../../document-form/document-form.interface';
import { timer } from 'rxjs';

@Component({
  selector: 'document-dialog-form',
  styleUrls: ['../document-dialog-template/global-document-dialog-template.scss'],
  templateUrl: './document-dialog-form.component.html',
})
export class DocumentDialogFormComponent extends AbstractDocumentDialogContainerComponent implements DocumentModelForm {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, queryParamsService, componentFactoryResolver);
  }

  protected onInit(): void {
    super.createComponent(this.component);
    this.subscribeComponentEvent();
  }

  protected subscribeComponentEvent(): void {
    if (this.dynamicComponent) {
      this.dynamicComponent.instance.callback.subscribe((e: DocumentFormEvent) => {
        this.globalDocumentDialogService.triggerEvent({ name: `Form${e.action}`, type: 'callback', messageType: e.messageType, messageContent: e.messageContent, options: { doc: e.doc } });
        if (e.action === 'Canceled') {
          this.close();
        } else if (['Created', 'Updated'].includes(e.action)) {
          timer(2000).subscribe(_ => {
            this.close();
            this.refresh(e.getRedirectUrl(e.doc));
          });
        }
      });
    }
  }
}
