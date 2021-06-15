import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { ACLService } from '@core/acl';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../creative-ring-tab-config';

@Component({
  selector: 'creative-ring-info-view',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-info-view.scss'],
  templateUrl: './creative-ring-info-view.component.html',
})
export class CreativeRingInfoViewComponent extends BaseDocumentViewComponent {

  @Input() loading: boolean;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.parseTabRoute(doc);
    }
  }

  tabs: any[] = [];

  documentModel: DocumentModel;

  private tabConfig: any[] = TAB_CONFIG;

  constructor(
    private aclService: ACLService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService);
  }

  protected parseTabRoute(doc: DocumentModel): void {
    if (this.tabs.length === 0) {
      const tabs = parseTabRoute(this.tabConfig, this.activatedRoute.snapshot.params);
      const subscription = this.aclService.filterRouterTabs(tabs, doc).subscribe((r: any[]) => {
        this.tabs = r;
      });
      this.subscription.add(subscription);
    }
  }

}
