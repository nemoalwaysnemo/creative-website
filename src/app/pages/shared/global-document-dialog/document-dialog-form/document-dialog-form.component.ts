import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { AbstractDocumentDialogContainerComponent } from '../abstract-document-dialog-container.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { DocumentModelForm } from '../../global-document-form/abstract-document-form.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { DocumentFormEvent } from '../../document-form/document-form.interface';
import { timer } from 'rxjs';

@Component({
  selector: 'document-dialog-form',
  styleUrls: ['./document-dialog-form.component.scss'],
  templateUrl: './document-dialog-form.component.html',
})
export class DocumentDialogFormComponent extends AbstractDocumentDialogContainerComponent implements DocumentModelForm {

  @Input() mode: 'create' | 'edit' = 'create';

  formCallbackEvent: DocumentFormEvent;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, queryParamsService, componentFactoryResolver);
  }

  protected onInit(): void {
    this.createComponent();
    this.subscribeEventEmitters();
  }

  protected createComponent(): void {
    if (!this.customComponent) {
      this.customComponent = this.createCustomComponent(this.dynamicTarget, this.component);
      this.customComponent.instance.mode = this.mode;
      this.customComponent.instance.documentModel = this.document;
    }
  }

  protected subscribeEventEmitters(): void {
    if (this.customComponent) {
      this.customComponent.instance.callback.subscribe((e: DocumentFormEvent) => {
        this.formCallbackEvent = e;
        if (e.action === 'canceled') {
          this.close();
        } else if (['created', 'updated'].includes(e.action)) {
          timer(2000).subscribe(_ => {
            this.close();
            this.refresh();
          });
        }
      });
    }
  }
}
