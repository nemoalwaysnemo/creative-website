import { Component, ComponentFactoryResolver, Type, Input, ComponentRef, ViewContainerRef, ViewChild } from '@angular/core';
import { AbstractDocumentDialogComponent } from './abstract-document-dialog.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../../shared/services/search-query-params.service';
import { DocumentFormDialogComponent } from './document-form-dialog/document-form-dialog.component';

@Component({
  selector: 'global-document-dialog',
  styleUrls: ['./global-document-dialog.component.scss'],
  templateUrl: './global-document-dialog.component.html',
})
export class GlobalDocumentDialogComponent extends AbstractDocumentDialogComponent {

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
    protected dialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(dialogService, queryParamsService, componentFactoryResolver);
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
    this.buildComponent('preview');
  }

  protected createFormComponent(): void {
    const component = this.buildComponent('form');
    if (component) {
      this.formComponentRef.instance.mode = (this.data || { mode: 'create' }).mode;
    }
  }

  protected createGeneralComponent(): void {
    const component = this.buildComponent('general');
    if (component) {
      this.customComponent.instance.callback.subscribe((e: DocumentDialogEvent) => {
      });
    }
  }

  protected buildComponent(type: string): ComponentRef<any> {
    if (!this[`${type}ComponentRef`] && this[`${type}Component`]) {
      this[`${type}ComponentRef`] = this.createCustomComponent(this[`${type}Target`], DocumentFormDialogComponent);
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
