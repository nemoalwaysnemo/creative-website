import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { ACLService } from '@core/acl';
import { DocumentPageService } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../creative-brand-tab-config';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'creative-brand-info-view',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-brand-info-view.scss'],
  templateUrl: './creative-brand-info-view.component.html',
})
export class CreativeBrandInfoViewComponent extends BaseDocumentViewComponent {

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

  constructor(protected activatedRoute: ActivatedRoute, private aclService: ACLService, protected documentPageService: DocumentPageService) {
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
