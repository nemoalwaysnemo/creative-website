import { Component, ComponentFactoryResolver, Type, Input, ComponentRef, ViewContainerRef, ViewChild } from '@angular/core';
import { AbstractDocumentDialogContainerComponent } from './abstract-document-dialog-container.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../../shared/services/search-query-params.service';
import { DocumentDialogFormComponent } from './document-dialog-form/document-dialog-form.component';
import { DocumentDialogPreviewComponent } from './document-dialog-preview/document-dialog-preview.component';
import { DocumentDialogGeneralComponent } from './document-dialog-general/document-dialog-general.component';

@Component({
  selector: 'global-document-dialog',
  styleUrls: ['./global-document-dialog.component.scss'],
  templateUrl: './global-document-dialog.component.html',
})
export class GlobalDocumentDialogComponent extends AbstractDocumentDialogContainerComponent {

  @Input()
  set type(type: 'preview' | 'form' | 'general') {
    this.dialogType = type;
    this.currentView = type;
  }

  @Input() previewComponent: Type<any>;

  @Input() formComponent: Type<any>;

  @Input() generalComponent: Type<any>;

  @ViewChild('previewTarget', { static: true, read: ViewContainerRef }) previewTarget: ViewContainerRef;

  @ViewChild('formTarget', { static: true, read: ViewContainerRef }) formTarget: ViewContainerRef;

  @ViewChild('generalTarget', { static: true, read: ViewContainerRef }) generalTarget: ViewContainerRef;

  currentView: string;

  protected dialogType: string;

  protected formComponentRef: ComponentRef<any>;

  protected previewComponentRef: ComponentRef<any>;

  protected generalComponentRef: ComponentRef<any>;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, queryParamsService, componentFactoryResolver);
  }

  selectView(view: string): void {
    const currentComponent: ComponentRef<any> = this[`${this.currentView}ComponentRef`];
    if (currentComponent) {
      currentComponent.destroy();
    }
    this.createComponent(view);
    this.currentView = view;
  }

  protected onInit(): void {

  }

  protected onOpen(e: DocumentDialogEvent): void {
    this.selectView(e.options.view || this.dialogType);
  }

  protected createComponent(type: string): void {
    switch (type) {
      case 'preview':
        this.createPreviewComponent();
        break;
      case 'form':
        this.createFormComponent();
        break;
      case 'general':
        this.createFormComponent();
        break;
      default:
        throw new Error(`Unknown Dialog view type: ${type}`);
    }
  }

  protected createPreviewComponent(): void {
    this.buildComponent('preview', DocumentDialogPreviewComponent);
  }

  protected createFormComponent(): void {
    this.buildComponent('form', DocumentDialogFormComponent);
  }

  protected createGeneralComponent(): void {
    this.buildComponent('general', DocumentDialogGeneralComponent);
  }

  protected buildComponent(type: string, component: Type<any>): ComponentRef<any> {
    if (!this[`${type}ComponentRef`] && this[`${type}Component`]) {
      this[`${type}ComponentRef`] = this.createCustomComponent(this[`${type}Target`], component);
      this[`${type}ComponentRef`].instance.title = this.title;
      this[`${type}ComponentRef`].instance.metadata = this.metadata;
      this[`${type}ComponentRef`].instance.documentModel = this.document;
      this[`${type}ComponentRef`].instance.component = this[`${type}Component`];
    } else if (!this[`${type}Component`]) {
      throw new Error(`Dialog injection component doesn't exist: ${type}`);
    }
    return this[`${type}ComponentRef`];
  }

}
