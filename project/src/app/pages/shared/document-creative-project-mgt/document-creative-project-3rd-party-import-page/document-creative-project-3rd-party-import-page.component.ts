import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { DocumentCreativeProjectMgtBasePageComponent } from '../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProject3rdImportRequestComponent } from './document-creative-project-3rd-party-import-request-page/document-creative-project-3rd-party-import-request-page.component';
import { TAB_CONFIG } from './document-creative-project-mgt-asset-tab-config';

@Component({
  selector: 'document-creative-project-3rd-party-import-asset-page',
  styleUrls: ['../document-creative-project-mgt.component.scss', './document-creative-project-3rd-party-import-page.component.scss'],
  templateUrl: './document-creative-project-3rd-party-import-page.component.html',
})
export class DocumentCreativeProject3rdPartyImportComponent extends DocumentCreativeProjectMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  protected onInit(): void {
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeProject3rdImportRequestComponent;
    this.changeView(component);
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
