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

  @Input() data: any;

  currentView: 'preview' | 'form' | 'general';

  @ViewChild('previewTarget', { static: true, read: ViewContainerRef }) previewTarget: ViewContainerRef;

  @ViewChild('formTarget', { static: true, read: ViewContainerRef }) formTarget: ViewContainerRef;

  @ViewChild('generalTarget', { static: true, read: ViewContainerRef }) generalTarget: ViewContainerRef;

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

  protected onInit(): void {
    this.createComponent();
  }

  protected createComponent(): void {
    switch (this.dialogType) {
      case 'preview':
        this.createPreviewComponent();
        break;
      case 'form':
        this.createFormComponent();
        break;
      default:
        this.createGeneralComponent();
        break;
    }
  }

  protected createPreviewComponent(): void {
    this.buildComponent('preview', DocumentDialogPreviewComponent);
  }

  protected createFormComponent(): void {
    const component = this.buildComponent('form', DocumentDialogFormComponent);
    if (component) {
      this.formComponentRef.instance.mode = (this.data || { mode: 'create' }).mode;
    }
  }

  protected createGeneralComponent(): void {
    const component = this.buildComponent('general', DocumentDialogGeneralComponent);
    if (component) {
      this.customComponent.instance.callback.subscribe((e: DocumentDialogEvent) => {
      });
    }
  }

  protected buildComponent(type: string, component: Type<any>): ComponentRef<any> {
    if (!this[`${type}ComponentRef`] && this[`${type}Component`]) {
      this[`${type}ComponentRef`] = this.createCustomComponent(this[`${type}Target`], component);
      this[`${type}ComponentRef`].instance.title = this.title;
      this[`${type}ComponentRef`].instance.document = this.document;
      this[`${type}ComponentRef`].instance.component = this[`${type}Component`];
    }
    return this[`${type}ComponentRef`];
  }

  onEvent(event: DocumentDialogEvent): void {
    if (event.name === 'viewChanged') {
      this.currentView = event.options.view;
    }
  }

}
