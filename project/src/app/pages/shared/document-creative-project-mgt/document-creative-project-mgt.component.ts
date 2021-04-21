import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { parseTabRoute } from '@core/services/helpers';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { CreativeProjectMgtBaseComponent } from './document-creative-project-mgt-base.component';
import { TAB_CONFIG } from './document-creative-project-mgt-tab-config';

@Component({
  selector: 'document-creative-project-mgt-page',
  styleUrls: ['./document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-mgt.component.html',
})
export class CreativeProjectMgtComponent extends CreativeProjectMgtBaseComponent {

  tabs: NbMenuItem[] = parseTabRoute(TAB_CONFIG);

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
    this.subscribeEvents();
  }

  protected onInit(): void {
    const defaultPage = this.getDefaultPage();
    if (defaultPage) {
      console.log(33333, defaultPage);
      this.changeView(defaultPage.component);
    }
  }

  private subscribeEvents(): void {
    this.documentPageService.onEventType(this.eventType).subscribe((event: GlobalEvent) => {
      console.log(6666, event);
    });
  }

  private getDefaultPage(): NbMenuItem {
    return this.tabs.find((x: NbMenuItem) => x.selected);
  }

}
