import { Component, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AdvanceSearch, NuxeoEnricher } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'backslash-asset-page',
  styleUrls: ['./backslash-asset-page.component.scss'],
  templateUrl: './backslash-asset-page.component.html',
})
export class BackslashAssetPageComponent extends GlobalDocumentViewComponent implements AfterViewChecked, OnDestroy {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    private router: Router) {
    super(advanceSearch, activatedRoute, queryParamsService);
    this.onRouterChange();
  }

  private onRouterChange(): void {
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
    ).subscribe((e: NavigationStart) => {
      if (!e.url.includes('/asset/')) {
        const header = document.querySelector('nb-layout-header');
        header.setAttribute('style', 'display:block');
        header.classList.add('fixed');
      }
    });
  }

  ngAfterViewChecked() {
    const header = document.querySelector('nb-layout-header');
    if (typeof (header) !== 'undefined' && header !== null) {
      header.setAttribute('style', 'display:none');
      header.classList.remove('fixed');
    }
  }

  ngOnDestroy(): void {
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

}
