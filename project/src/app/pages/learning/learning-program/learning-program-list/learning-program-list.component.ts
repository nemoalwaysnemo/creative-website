import { Component } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-program-list',
  styleUrls: ['./learning-program-list.component.scss'],
  templateUrl: './learning-program-list.component.html',
})
export class LearningProgramListComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  documents: DocumentModel[] = [];

  private params: any = {
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
