import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { DocumentCreativeCampaignMgtBasePageComponent } from './document-creative-campaign-mgt-base-page.component';
import { TAB_CONFIG } from './document-creative-campaign-mgt-tab-config';

@Component({
  selector: 'document-creative-campaign-mgt-page',
  styleUrls: ['./document-creative-campaign-mgt.component.scss'],
  templateUrl: './document-creative-campaign-mgt.component.html',
})
export class DocumentCreativeCampaignMgtComponent extends DocumentCreativeCampaignMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
  }

  protected onInit(): void {
    const page = this.getAssetPageConfig(this.templateSettings.homePage) || this.getDefaultPageConfig();
    if (page) {
      this.changeView(page.component, this.templateSettings);
    }
  }

  private getDefaultPageConfig(): NbMenuItem {
    return this.tabs.find((t: NbMenuItem) => t.selected);
  }

  private getAssetPageConfig(name: string): any {
    return this.tabs.find((t: NbMenuItem) => t.id === name);
  }

  protected onPageChanged(event: GlobalEvent): void {
    if (event.data.component) {
      this.changeView(event.data.component, event.data.settings);
    }
  }

}
