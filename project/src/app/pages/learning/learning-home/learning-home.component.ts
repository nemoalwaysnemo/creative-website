import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentPageService, GlobalDocumentViewComponent } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-home',
  styleUrls: ['./learning-home.component.scss'],
  templateUrl: './learning-home.component.html',
})
export class LearningHomeComponent extends GlobalDocumentViewComponent {

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  headline: string = 'We are perpetual learners.';

  subHead: string = 'Continuous growth is the cornerstone of success throughout the TBWA Collective.';

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
