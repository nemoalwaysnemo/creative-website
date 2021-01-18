import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel } from '@core/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentPageService, GlobalDocumentViewComponent } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-remote-page',
  template: `
    <div class="document" [nbSpinner]="loading" nbSpinnerStatus="disabled" [ngStyle]="loading ? {'min-height': '150px'} : {'height': '100%'}">
      <ng-container *ngIf="iframeUrl">
        <iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>
      </ng-container>
    </div>
  `,
})
export class LearningRemotePageComponent extends GlobalDocumentViewComponent {

  iframeUrl: SafeResourceUrl;

  loading: boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
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
      ecm_fulltext: '',
      app_global_ext_app_iframe: true,
      ecm_path: NUXEO_PATH_INFO.LEARNING_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_FOLDER_TYPE,
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