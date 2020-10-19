import { Component, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver, ComponentRef, OnInit, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { parseTabRoute } from '@core/services/helpers';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { TAB_CONFIG } from './creative-project-asset-template-tab-config';
import { GLOBAL_DOCUMENT_FORM } from '../../../global-document-form';

@Component({
  selector: 'creative-project-asset-template',
  styleUrls: ['../global-document-dialog-template.scss', './creative-project-asset-template.component.scss'],
  templateUrl: './creative-project-asset-template.component.html',
})
export class CreativeProjectAssetTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'creative-project-asset-template';

  writePermission$: Observable<boolean> = observableOf(false);

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  dialogMetadata: any = {
    formMode: 'edit',
  };

  protected dynamicComponentRef: ComponentRef<any>;

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  getDialogFormTemplateName(doc: DocumentModel): string {
    let name: string = '';
    if (doc.type === 'App-Library-Project') {
      name = GLOBAL_DOCUMENT_FORM.CREATIVE_PROJECT_FORM.NAME;
    }
    return name;
  }

  onMenuClick(item: NbMenuItem): void {
    this.changeView(item.component);
  }

  protected onInit(): void {
    const selectedTab = this.dialogSettings.selectedTab;
    let defaultMenu = this.tabs[0];
    if (this.dialogSettings.selectedMenu) {
      defaultMenu = this.tabs.find((x) => x.title === this.dialogSettings.selectedMenu) || defaultMenu;
    }
    defaultMenu.selected = true;
    this.changeView(defaultMenu.component, { selectedTab });
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
    this.clearDynamicComponent();
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
      const brand = doc.filterParents(['App-Library-Folder']).pop();
      if (brand) {
        doc.setParent(brand, 'brand');
      }
      const campaignMgt = doc.filterParents(['App-Library-Campaign-Mgt-Folder']).pop();
      if (campaignMgt) {
        doc.setParent(campaignMgt, 'parent');
      }
      this.document = doc;
    }
  }

  private changeView(component: Type<any>, settings: any = {}): void {
    if (component) {
      this.clearDynamicComponent();
      this.buildComponent(this.dynamicTarget, component, settings);
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

  protected buildComponent(dynamicTarget: ViewContainerRef, component: Type<any>, settings: any = {}): void {
    this.dynamicComponentRef = this.createDynamicComponent(dynamicTarget, component);
    this.dynamicComponentRef.instance.documentModel = this.document;
    this.dynamicComponentRef.instance.templateSettings = settings;
  }

}
