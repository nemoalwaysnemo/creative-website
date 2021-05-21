import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { DocumentCreativeProjectMgtBasePageComponent } from './document-creative-project-mgt-base-page.component';
import { TAB_CONFIG } from './document-creative-project-mgt-tab-config';

@Component({
  selector: 'document-creative-project-mgt-page',
  styleUrls: ['./document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-mgt.component.html',
})
export class DocumentCreativeProjectMgtComponent extends DocumentCreativeProjectMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
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