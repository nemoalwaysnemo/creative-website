import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NbMenuItem } from '@core/nebular/theme';
import { parseTabRoute } from '@core/services/helpers';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { CreativeProjectMgtBaseTemplateComponent } from './document-creative-project-mgt-base-template.component';
import { TAB_CONFIG } from './document-creative-project-mgt-tab-config';

@Component({
  selector: 'document-creative-project-mgt-page',
  styleUrls: ['./document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-mgt.component.html',
})
export class CreativeProjectMgtComponent extends CreativeProjectMgtBaseTemplateComponent {

  tabs: NbMenuItem[] = parseTabRoute(TAB_CONFIG);

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
    }
  }

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
      this.changeView(defaultPage.component);
    }
  }

  private subscribeEvents(): void {
    this.documentPageService.onEventType(this.eventType).subscribe((event: GlobalEvent) => {

    });
  }

  private getDefaultPage(): NbMenuItem {
    return this.tabs.find((x: NbMenuItem) => x.selected);
  }

}
