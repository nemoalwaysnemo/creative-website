import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel } from '@core/api';
import { ACLService } from '@core/acl';
import { DocumentPageService } from '@pages/shared';
import { parseTabRoute, vocabularyFormatter } from '@core/services/helpers';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { TAB_CONFIG } from '../creative-agency-tab-config';

@Component({
  selector: 'creative-agency-info-view',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-agency-info-vew.component.html',
})
export class CreativeAgencyInfoViewComponent extends BaseDocumentViewComponent {

  @Input() loading: boolean;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.parseTabRoute();
    }
  }

  tabs: any[] = [];

  documentModel: DocumentModel;

  private tabConfig: any[] = TAB_CONFIG;

  constructor(protected activatedRoute: ActivatedRoute, private aclService: ACLService, protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  protected parseTabRoute(): void {
    if (this.tabs.length === 0) {
      const tabs = parseTabRoute(this.tabConfig, this.activatedRoute.snapshot.params);
      this.aclService.filterRouterTabs(tabs, this.documentModel).subscribe((r: any[]) => {
        this.tabs = r;
      });
    }
  }

}
