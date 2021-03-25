import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalDocumentDialogService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-about',
  styleUrls: ['./learning-about.component.scss'],
  templateUrl: './learning-about.component.html',
})
export class LearningAboutComponent extends GlobalDocumentViewComponent {

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path_eq: NUXEO_PATH_INFO.LEARNING_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_BASE_FOLDER_TYPE,
    };
  }
}
