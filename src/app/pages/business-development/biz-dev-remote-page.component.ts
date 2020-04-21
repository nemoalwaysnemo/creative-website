import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AbstractDocumentViewComponent } from '@pages/shared/abstract-classes/abstract-document-view.component';
import { AdvanceSearch, DocumentModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { SearchQueryParamsService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'biz-dev-remote-page',
  template: `<iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>`,
})
export class BizDevRemotePageComponent extends AbstractDocumentViewComponent implements OnInit {

  iframeUrl: SafeResourceUrl;

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    private sanitizer: DomSanitizer) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    if (doc) {
      this.buildIframeUrl(doc);
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      app_global_ext_app_iframe: true,
      ecm_path: NUXEO_PATH_INFO.BIZ_DEV_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_META_INFO.BIZ_DEV_FOLDER_TYPE,
      ecm_path_eq: NUXEO_PATH_INFO.BIZ_DEV_10X_FOLDER_PATH,
    };
  }

  private buildIframeUrl(doc: DocumentModel): void {
    const url = doc.get('The_Loupe_Main:url');
    if (url) {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.redirectTo404();
    }
  }

}
