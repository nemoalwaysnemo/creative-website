import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { DocumentCreativeCampaignMgtBasePageComponent } from '../document-creative-campaign-mgt-base-page.component';
import { DocumentCreativeCampaignAssetHomeComponent } from './document-creative-campaign-asset-home/document-creative-campaign-asset-home.component';
import { TAB_CONFIG } from './document-creative-campaign-mgt-asset-tab-config';

@Component({
  selector: 'document-creative-campaign-asset-page',
  styleUrls: ['../document-creative-campaign-mgt.component.scss', './document-creative-campaign-asset-page.component.scss'],
  templateUrl: './document-creative-campaign-asset-page.component.html',
})
export class DocumentCreativeCampaignAssetPageComponent extends DocumentCreativeCampaignMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  protected onInit(): void {
    const component = this.templateSettings.homeView ? this.getAssetViewConfig(this.templateSettings.homeView).component : DocumentCreativeCampaignAssetHomeComponent;
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
