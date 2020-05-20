import { Component, ComponentFactoryResolver, Type, Input, ComponentRef, ViewContainerRef, ViewChild } from '@angular/core';
import { GoogleAnalyticsService } from '@core/services/google-analytics.service';
import { AbstractDocumentDialogContainerComponent } from './abstract-document-dialog-container.component';
import { GlobalDocumentDialogService, DocumentDialogEvent } from './global-document-dialog.service';
import { SearchQueryParamsService } from '../../shared/services/search-query-params.service';
import { DocumentDialogFormComponent } from './document-dialog-form/document-dialog-form.component';
import { DocumentDialogPreviewComponent } from './document-dialog-preview/document-dialog-preview.component';
import { DocumentDialogCustomComponent } from './document-dialog-custom/document-dialog-custom.component';

@Component({
  selector: 'global-document-dialog',
  styleUrls: ['./global-document-dialog.component.scss'],
  templateUrl: './global-document-dialog.component.html',
})
export class GlobalDocumentDialogComponent extends AbstractDocumentDialogContainerComponent {

  @Input()
  set type(type: 'preview' | 'form' | 'custom') {
    this.dialogType = type;
    this.currentView = type;
  }

  @Input() previewComponent: Type<any>;

  @Input() formComponent: Type<any>;

  @Input() customComponent: Type<any>;

  @ViewChild('previewTarget', { static: true, read: ViewContainerRef }) previewTarget: ViewContainerRef;

  @ViewChild('formTarget', { static: true, read: ViewContainerRef }) formTarget: ViewContainerRef;

  @ViewChild('customTarget', { static: true, read: ViewContainerRef }) customTarget: ViewContainerRef;

  protected currentView: string;

  protected dialogType: string;

  protected formComponentRef: ComponentRef<any>;

  protected previewComponentRef: ComponentRef<any>;

  protected customComponentRef: ComponentRef<any>;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected googleAnalyticsService: GoogleAnalyticsService,
  ) {
    super(globalDocumentDialogService, queryParamsService, componentFactoryResolver);
    this.subscribeEvents();
  }

  selectView(view: string, component?: Type<any>): void {
    const currentComponent: ComponentRef<any> = this[`${this.currentView}ComponentRef`];
    if (currentComponent) {
      currentComponent.destroy();
    }
    this.createComponent(view, component);
    this.currentView = view;
  }

  protected onInit(): void {

  }

  protected onOpen(e: DocumentDialogEvent): void {
    const view = e.options.view || this.dialogType;
    this.globalDocumentDialogService.triggerEvent({ name: 'ViewOpened', type: 'built-in', messageContent: 'View Opened', options: { view } });
    this.googleAnalyticsEventTrack(e);
    this.selectView(view);
  }

  protected createComponent(type: string, component?: Type<any>): void {
    switch (type) {
      case 'preview':
        this.createPreviewComponent(component);
        break;
      case 'form':
        this.createFormComponent(component);
        break;
      case 'custom':
        this.createGeneralComponent(component);
        break;
      default:
        throw new Error(`Unknown Dialog view type: ${type}`);
    }
  }

  protected createPreviewComponent(component?: Type<any>): void {
    this.buildComponent('preview', DocumentDialogPreviewComponent, component);
  }

  protected createFormComponent(component?: Type<any>): void {
    this.buildComponent('form', DocumentDialogFormComponent, component);
  }

  protected createGeneralComponent(component?: Type<any>): void {
    this.buildComponent('custom', DocumentDialogCustomComponent, component);
  }

  protected buildComponent(type: string, componentContainer: Type<any>, component?: Type<any>): ComponentRef<any> {
    if (!this[`${type}Component`]) {
      throw new Error(`Dialog injection component doesn't exist: ${type}`);
    }
    this[`${type}ComponentRef`] = this.createDynamicComponent(this[`${type}Target`], componentContainer);
    this[`${type}ComponentRef`].instance.title = this.title;
    this[`${type}ComponentRef`].instance.metadata = this.settings;
    this[`${type}ComponentRef`].instance.documentModel = this.document;
    this[`${type}ComponentRef`].instance.redirectUrl = this.redirectUrl;
    this[`${type}ComponentRef`].instance.mainViewChanged = this.mainViewChanged;
    this[`${type}ComponentRef`].instance.component = component || this[`${type}Component`];
    return this[`${type}ComponentRef`];
  }

  protected subscribeEvents(): void {
    this.subscription = this.globalDocumentDialogService.onEventName('ViewChanged').subscribe((e: DocumentDialogEvent) => {
      const view = e.options.view || this.dialogType;
      this.mainViewChanged = this.dialogType !== view;
      this.selectView(view, e.options.component);
    });
  }

  protected googleAnalyticsEventTrack(e: DocumentDialogEvent): void {
    const type = e.options.view || this.dialogType;
    let category = 'PopupPreview';
    if (type === 'form') {
      category = 'PopupForm';
    } else if (type === 'custom') {
      category = 'PopupDialog';
    }
    this.googleAnalyticsService.eventTrack({ 'event_category': category, 'event_action': 'Open', 'event_label': 'Open', 'dimensions.docId': this.document.uid });
  }

}
