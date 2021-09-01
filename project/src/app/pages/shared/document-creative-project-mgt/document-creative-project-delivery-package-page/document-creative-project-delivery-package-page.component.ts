import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { TAB_CONFIG } from './document-creative-project-mgt-package-tab-config';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { DocumentCreativeProjectMgtBasePageComponent } from '../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProjectDeliveryPackageHomeComponent } from './document-creative-project-delivery-package-home/document-creative-project-delivery-package-home.component';

@Component({
  selector: 'document-creative-project-delivery-package-page',
  styleUrls: ['../document-creative-project-mgt.component.scss', './document-creative-project-delivery-package-page.component.scss'],
  templateUrl: './document-creative-project-delivery-package-page.component.html',
})
export class DocumentCreativeProjectDeliveryPackagePageComponent extends DocumentCreativeProjectMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.subscribeEvents();
  }

  protected onInit(): void {
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeProjectDeliveryPackageHomeComponent;
    this.changeView(component, this.templateSettings);
  }

  protected onViewChanged(event: GlobalEvent): void {
    const data = this.getAssetViewConfig(event.data.view);
    if (data) {
      this.changeView(data.component, event.data.settings);
    }
  }

  private getAssetViewConfig(name: string): any {
    return this.tabs.find((t: NbMenuItem) => t.id === name);
  }
}
