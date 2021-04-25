import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { DocumentCreativeProjectMgtBasePageComponent } from '../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProjectAssetHomeComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';
import { TAB_CONFIG } from './document-creative-project-mgt-asset-tab-config';

@Component({
  selector: 'document-creative-project-asset-page',
  styleUrls: ['../document-creative-project-mgt.component.scss', './document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-page.component.html',
})
export class DocumentCreativeProjectAssetPageComponent extends DocumentCreativeProjectMgtBasePageComponent {

  tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  protected onInit(): void {
    this.changeView(DocumentCreativeProjectAssetHomeComponent);
  }

  protected onViewChanged(event: GlobalEvent): void {
    const view = this.getAssetView(event.data.view);
    if (view) {
      this.changeView(view.component);
    }
  }

  private getAssetView(name: string): any {
    return this.tabs.find((t: NbMenuItem) => t.id === name);
  }

}
