import { Component } from '@angular/core';
import { DocumentPageService, BaseDocumentViewComponent } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';

@Component({
  selector: 'learning-program-button',
  styleUrls: ['./learning-program-button.component.scss'],
  templateUrl: './learning-program-button.component.html',
})
export class LearningProgramButtonComponent extends BaseDocumentViewComponent {

  uid: string;

  private params: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.LEARNING_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_FOLDER_TYPE,
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
        res.entries.forEach(document => {
          if (document.openLinkInIframe()){
            this.uid = document.uid;
          }
        });
      });
    this.subscription.add(subscription);
  }

}
