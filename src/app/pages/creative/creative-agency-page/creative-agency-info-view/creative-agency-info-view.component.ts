import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { TAB_CONFIG } from '../creative-agency-tab-config';
import { ActivatedRoute } from '@angular/router';
import { ACLService } from '@core/acl';
import { DocumentPageService } from '@pages/shared';
import { parseTabRoute, parseCountry } from '@core/services/helpers';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'creative-agency-info-view',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-agency-info-vew.component.html',
})
export class CreativeAgencyInfoViewComponent extends BaseDocumentViewComponent {

  @Input() loading: boolean;

  @Input() document: DocumentModel;

  private tabConfig: any[] = TAB_CONFIG;

  tabs: any[] = [];

  constructor(protected activatedRoute: ActivatedRoute, private aclService: ACLService, protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    super.onInit();
    this.parseTabRoute();
  }

  protected parseTabRoute(): void {
    if (this.tabs.length === 0) {
      const tabs = parseTabRoute(this.tabConfig, this.activatedRoute.snapshot.params);
      this.aclService.filterRouterTabs(tabs).subscribe((r: any[]) => {
        this.tabs = r;
      });
    }
  }

  parseCountry(list: string[]) {
    return parseCountry(list);
  }

}
