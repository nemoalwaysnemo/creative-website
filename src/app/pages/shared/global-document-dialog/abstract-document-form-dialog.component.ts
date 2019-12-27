import { Component, Input, Output, EventEmitter, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { AbstractDocumentDialogComponent } from './abstract-document-dialog.component';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentModelForm } from '../abstract-classes/abstract-document-form.component';
import { DocumentModel } from '@core/api';

export abstract class AbstractDocumentFormDialogComponent extends AbstractDocumentDialogComponent implements DocumentModelForm {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  @Input() docType: string;

  @Input() mode: 'create' | 'edit' = 'create';

  @Input() component: Type<DocumentModelForm>;

  protected customComponent: ComponentRef<any>;

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(dialogService);
  }

  protected onInit(): void {
    this.createComponent();
    this.subscribeEventEmitters();
  }

  protected onDestroy(): void {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
    this.subscription.unsubscribe();
  }

  protected createComponent() {
    if (!this.customComponent) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
      this.customComponent = this.dynamicTarget.createComponent(componentFactory);
      this.customComponent.instance.mode = this.mode;
      this.customComponent.instance.docType = this.docType;
      this.customComponent.instance.documentModel = this.document;
    }
  }

  protected subscribeEventEmitters() {
    this.customComponent.instance.onCanceled.subscribe(_ => {
      this.close();
    });
    this.customComponent.instance.onCreated.subscribe(_ => {
    });
    this.customComponent.instance.onUpdated.subscribe(_ => {
    });
  }
}
