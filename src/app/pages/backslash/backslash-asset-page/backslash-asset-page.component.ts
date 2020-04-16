import { Component, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdvanceSearch, NuxeoEnricher, DocumentModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';

@Component({
  selector: 'backslash-asset-page',
  styleUrls: ['./backslash-asset-page.component.scss'],
  templateUrl: './backslash-asset-page.component.html',
})
export class BackslashAssetPageComponent extends AbstractDocumentViewComponent implements AfterViewChecked {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    private router: Router) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngAfterViewChecked() {
    const header = document.querySelector('nb-layout-header');
    if (typeof(header) !== 'undefined' && header !== null) {
      header.setAttribute('style', 'display:none');
      header.classList.remove('fixed');
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BACKSLASH_ARTICLE_VIDEO_TYPES,
    };
  }

  protected getCurrentDocumentRequestParams(): any {
    return {
      enrichers: {
        document: [
          NuxeoEnricher.document.PREVIEW,
          NuxeoEnricher.document.HIGHLIGHT,
          NuxeoEnricher.document.THUMBNAIL,
          NuxeoEnricher.document.FAVORITES,
          NuxeoEnricher.document.PERMISSIONS,
          NuxeoEnricher.document.BREADCRUMB,
        ],
      },
    };
  }

  navigateToBackslashHome() {
    const header = document.querySelector('nb-layout-header');
    header.setAttribute('style', 'display:block');
    header.classList.add('fixed');
    this.router.navigate(['/p/backslash/home']);
  }
}
