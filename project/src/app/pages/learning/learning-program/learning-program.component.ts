import { Component } from '@angular/core';
import { DocumentPageService } from '@pages/shared';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-program',
  styleUrls: ['./learning-program.component.scss'],
  templateUrl: './learning-program.component.html',
})
export class LearningProgramComponent extends BaseDocumentViewComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  programs: DocumentModel;

  private params: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: NUXEO_PATH_INFO.LEARNING_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_FOLDER_TYPE,
  };

  onInit(): void {
    this.search(this.params);
    this.setCurrentDocument();
  }

  private search(params: {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        console.log(1);
        this.programs = res.entries.shift();
      });
    this.subscription.add(subscription);
  }

}
