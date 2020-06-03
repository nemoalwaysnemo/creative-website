import { Component, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdvanceSearchService } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-asset-page',
  styleUrls: ['./backslash-asset-page.component.scss'],
  templateUrl: './backslash-asset-page.component.html',
})
export class BackslashAssetPageComponent extends GlobalDocumentViewComponent implements AfterViewChecked, OnDestroy {

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    private router: Router) {
    super(advanceSearchService, activatedRoute, documentPageService);
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
      ecm_primaryType: NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES,
    };
  }

}
