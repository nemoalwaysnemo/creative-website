import { Component } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoPagination, NuxeoRequestOptions } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-program-map',
  styleUrls: ['./learning-program-map.component.scss'],
  templateUrl: './learning-program-map.component.html',
})
export class LearningProgramMapComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  documents: DocumentModel[] = [];

  private params: any = {
    pageSize: 5,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.LEARNING_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_ASSET_TYPE,
  };

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.search(this.params);
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
