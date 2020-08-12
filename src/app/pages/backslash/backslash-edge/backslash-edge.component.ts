import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../backslash-tab-config';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-edge',
  styleUrls: ['./backslash-edge.component.scss'],
  templateUrl: './backslash-edge.component.html',
})
export class BackslashEdgeComponent extends GlobalDocumentViewComponent {

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
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
      ecm_path_eq: NUXEO_PATH_INFO.BACKSLASH_EDGE_DOCS_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ASSET_FOLDER_TYPE,
    };
  }

}
