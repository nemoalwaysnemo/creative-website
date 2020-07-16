import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalDocumentDialogService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-home',
  styleUrls: ['./backslash-home.component.scss'],
  templateUrl: './backslash-home.component.html',
})
export class BackslashHomeComponent extends GlobalDocumentViewComponent {

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
      ecm_path_eq: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_FOLDER_TYPE,
    };
  }
}
