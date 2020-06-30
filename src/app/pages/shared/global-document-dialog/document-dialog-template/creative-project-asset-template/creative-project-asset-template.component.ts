import { Component, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { parseTabRoute } from '@core/services/helpers';
import { DocumentModel } from '@core/api';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { TAB_CONFIG } from './creative-project-asset-template-tab-config';
import { GLOBAL_DOCUMENT_FORM } from '../../../global-document-form';

@Component({
  selector: 'creative-project-asset-template',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './creative-project-asset-template.component.html',
})
export class CreativeProjectAssetTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'creative-project-asset-template';

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  protected dynamicComponentRef: ComponentRef<any>;

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  onMenuClick(item: NbMenuItem): void {
    this.changeView(item.component);
  }

  protected onOpen(): void {
    this.changeView(this.tabs[0].component);
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
    this.clearDynamicComponent();
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      const brand = doc.filterParents(['App-Library-Folder']).pop();
      if (brand) {
        doc.setParent(brand, 'brand');
      }
      this.document = doc;
    }
  }

  private changeView(component: Type<any>): void {
    if (component) {
      this.clearDynamicComponent();
      this.buildComponent(this.dynamicTarget, component);
    }
  }

  private clearDynamicComponent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = null;
    }
  }

  private createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected buildComponent(dynamicTarget: ViewContainerRef, component: Type<any>): void {
    this.dynamicComponentRef = this.createDynamicComponent(dynamicTarget, component);
    this.dynamicComponentRef.instance.documentModel = this.document;
  }

  getDialogTemplateName(doc: DocumentModel): string {
    let name: string = '';
    if (doc.type === 'App-Library-Project') {
      name = GLOBAL_DOCUMENT_FORM.CREATIVE_PROJECT_FORM.NAME;
    }
    return name;
  }

}
