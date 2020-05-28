import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { TAB_CONFIG } from '../creative-brand-tab-config';
import { ActivatedRoute } from '@angular/router';
import { parseTabRoute } from '@core/services/helpers';
import { ACLService } from '@core/acl';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'creative-brand-info-view',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-brand-info-vew.component.html',
})
export class CreativeBrandInfoViewComponent extends BaseDocumentViewComponent {

  @Input() loading: boolean;

  @Input() document: DocumentModel;

  private tabConfig: any[] = TAB_CONFIG;

  tabs: any[] = [];

  constructor(protected activatedRoute: ActivatedRoute, private aclService: ACLService) {
    super();
  }

  onInit(): void {
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

}
