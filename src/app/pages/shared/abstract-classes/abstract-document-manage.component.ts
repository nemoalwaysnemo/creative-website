import { AdvanceSearch } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractDocumentViewComponent } from './abstract-document-view.component';
import { ActivatedRoute } from '@angular/router';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

export abstract class AbstractDocumentManageComponent extends AbstractDocumentViewComponent {

  tabs: any[] = [];

  protected tabConfig: any[];

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  onInit() {
    super.onInit();
    this.parseTabRoute();
  }

  protected parseTabRoute(): void {
    if (this.tabs.length === 0) {
      const params: any = this.activatedRoute.snapshot.params;
      for (const config of this.tabConfig) {
        const tab: any = { title: config['title'], route: config['route'] };
        for (const key of ['type', 'id']) {
          tab['route'] = tab.route.replace(`:${key}`, params[key]);
        }
        this.tabs.push(tab);
      }
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPES,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_AND_BRAND_FOLDER_TYPE,
    };
  }
}
