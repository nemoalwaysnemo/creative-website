import { Input, Type, ComponentRef, ViewContainerRef, ViewChild, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { AbstractDocumentDialogBaseTemplateComponent } from './abstract-document-dialog-base-template.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';

export abstract class AbstractDocumentDialogContainerComponent extends AbstractDocumentDialogBaseTemplateComponent {

  @Input() component: Type<any>;

  @Output() event$: EventEmitter<DocumentDialogEvent> = new EventEmitter<DocumentDialogEvent>();

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  protected customComponent: ComponentRef<any>;

  protected subscription: Subscription = new Subscription();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  protected onInit(): void {
    this.createComponent();
  }

  protected createCustomComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected createComponent(type?: string, component?: Type<any>): void {
    if (!this.customComponent) {
      this.customComponent = this.createCustomComponent(this.dynamicTarget, this.component);
    }
    this.customComponent.instance.metadata = this.settings;
    this.customComponent.instance.documentModel = this.document;
    this.customComponent.instance.mainViewChanged = this.mainViewChanged;
  }

  protected onDestroy(): void {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
    this.subscription.unsubscribe();
  }

}
