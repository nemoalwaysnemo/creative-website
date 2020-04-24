import { Component, Input, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { AbstractDocumentDialogComponent } from '../abstract-document-dialog.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { DocumentModelForm } from '../../abstract-classes/abstract-document-form.component';
import { SearchQueryParamsService } from '../../../shared/services/search-query-params.service';
import { DocumentFormEvent } from '../../document-form/document-form.interface';
import { timer } from 'rxjs';

@Component({
  selector: 'document-form-dialog',
  styleUrls: ['./document-form-dialog.component.scss'],
  templateUrl: './document-form-dialog.component.html',
})
export class DocumentFormDialogComponent extends AbstractDocumentDialogComponent implements DocumentModelForm {

  @Input() mode: 'create' | 'edit' = 'create';

  formCallbackEvent: DocumentFormEvent;

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(dialogService, queryParamsService, componentFactoryResolver);
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
