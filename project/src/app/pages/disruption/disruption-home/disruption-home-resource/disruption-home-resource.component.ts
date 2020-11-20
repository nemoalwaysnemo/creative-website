import { Component } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams } from '@core/api';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { DocumentPageService } from '../../../shared/services/document-page.service';
import { TAB_CONFIG } from '../../disruption-tab-config';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-home-resource',
  styleUrls: ['./disruption-home-resource.component.scss'],
  templateUrl: './disruption-home-resource.component.html',
})
export class DisruptionHomeResourceComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  documents: DocumentModel[] = [];

  private folderParams: any = {
    pageSize: 50,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_FOLDER_TYPE,
  };

  private tabs: any[] = TAB_CONFIG;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.search(this.folderParams);
  }

  private search(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries.filter((doc: DocumentModel) => this.tabs.some(x => doc.title === x.title));
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

}
