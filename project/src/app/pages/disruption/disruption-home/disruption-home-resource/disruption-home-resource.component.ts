import { Component, Input } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams } from '@core/api';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { DocumentPageService } from '../../../shared/services/document-page.service';
import { TAB_CONFIG } from '../../disruption-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-home-resource',
  styleUrls: ['./disruption-home-resource.component.scss'],
  templateUrl: './disruption-home-resource.component.html',
})
export class DisruptionHomeResourceComponent extends BaseDocumentViewComponent {

  @Input() enableTitle: boolean = false;

  loading: boolean = true;

  enableFeature: boolean = true;

  documents: DocumentModel[] = [];

  private params: any = {
    pageSize: 50,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:DISRUPTION_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_FOLDER_TYPE,
  };

  private tabs: any[] = TAB_CONFIG;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.search(this.params);
  }

  private search(params: any = {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries.filter((doc: DocumentModel) => this.tabs.some(x => doc.title === x.title));
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

}
