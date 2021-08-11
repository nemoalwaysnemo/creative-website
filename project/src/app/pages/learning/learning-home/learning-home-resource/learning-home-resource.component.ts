import { Component } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { TAB_CONFIG } from '../../learning-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-home-resource',
  styleUrls: ['./learning-home-resource.component.scss'],
  templateUrl: './learning-home-resource.component.html',
})
export class LearningHomeResourceComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  enableFeature: boolean = true;

  documents: DocumentModel[] = [];

  private params: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:LEARNING_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_FOLDER_TYPE,
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

  private search(params: any = {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
