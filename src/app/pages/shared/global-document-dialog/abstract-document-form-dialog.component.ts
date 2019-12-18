import { Component, Input, Output, EventEmitter, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { AbstractDocumentDialogComponent } from './abstract-document-dialog.component';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentModelForm } from '../abstract-classes/abstract-document-form.component';
import { DocumentModel } from '@core/api';

export abstract class AbstractDocumentFormDialogComponent extends AbstractDocumentDialogComponent {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  @Input() component: Type<DocumentModelForm>;

  @Output() onCreated: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();

  @Output() onUpdated: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  protected customComponent: ComponentRef<any>;

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(dialogService);
  }

  protected onInit(): void {
    this.createComponent();
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
      this.customComponent.instance.target = this.customComponent.instance.setTargetModel(this.document);
    }
  }

}
