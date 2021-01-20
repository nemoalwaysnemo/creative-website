import { Component } from '@angular/core';
import { DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { TAB_CONFIG } from '../learning-tab-config';
@Component({
  selector: 'learning-alumni',
  styleUrls: ['./learning-alumni.component.scss'],
  templateUrl: './learning-alumni.component.html',
})
export class LearningAlumniComponent extends BaseDocumentViewComponent {


  loading: boolean = true;

  enableFeature: boolean = true;

  documents: DocumentModel[] = [];

  private params: any = {
    pageSize: 12,
    currentPageIndex: 0,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_X_FOLDER_PATH,
  };

  private tabs: any[] = TAB_CONFIG;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.search(this.params);
  }

  getAssetUrl(doc: DocumentModel): string {
    let url: string = '/p/learning';
    for (const tab of this.tabs) {
      if (doc.path.includes(tab.title)) {
        url = tab.route;
      }
    }
    return url;
  }

  goToLink(doc: DocumentModel): void {
    this.documentPageService.goToExternalLink(doc);
  }

  private search(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}

