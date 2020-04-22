import { Component, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AdvanceSearch, NuxeoEnricher, DocumentModel } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'backslash-asset-page',
  styleUrls: ['./backslash-asset-page.component.scss'],
  templateUrl: './backslash-asset-page.component.html',
})
export class BackslashAssetPageComponent extends AbstractDocumentViewComponent implements AfterViewChecked, OnDestroy {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    private router: Router) {
    super(advanceSearch, activatedRoute, queryParamsService);
    this.routeEvent(router);
  }

  routeEvent(router) {
    this.subscription = router.events
      .subscribe(e => {
        if (e instanceof NavigationStart) {
          if (e.url.split('/')[3] !== 'asset') {
            const header = document.querySelector('nb-layout-header');
            header.setAttribute('style', 'display:block');
            header.classList.add('fixed');
          }
        }
      });
  }
  ngAfterViewChecked() {
    const header = document.querySelector('nb-layout-header');
    if (typeof(header) !== 'undefined' && header !== null) {
      header.setAttribute('style', 'display:none');
      header.classList.remove('fixed');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
}
