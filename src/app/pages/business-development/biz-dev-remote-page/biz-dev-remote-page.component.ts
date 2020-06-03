import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GlobalDocumentViewComponent } from '@pages/shared/abstract-classes/global-document-view.component';
import { AdvanceSearchService, DocumentModel } from '@core/api';
import { DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'biz-dev-remote-page',
  template: `
    <div class="document" [nbSpinner]="loading" nbSpinnerStatus="disabled" [ngStyle]="loading ? {'min-height': '150px'} : {'height': '100%'}">
      <ng-container *ngIf="iframeUrl">
        <iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>
      </ng-container>
    </div>
  `,
})
export class BizDevRemotePageComponent extends GlobalDocumentViewComponent implements OnInit {

  iframeUrl: SafeResourceUrl;

  loading: boolean = true;

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    private sanitizer: DomSanitizer) {
    super(advanceSearchService, activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
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
      ecm_primaryType: NUXEO_DOC_TYPE.BIZ_DEV_FOLDER_TYPE,
      ecm_path_eq: NUXEO_PATH_INFO.BIZ_DEV_10X_FOLDER_PATH,
    };
  }

  private buildIframeUrl(doc: DocumentModel): void {
    const url = doc.get('The_Loupe_Main:url');
    if (url) {
      this.loading = false;
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.redirectTo404();
    }
  }

}
