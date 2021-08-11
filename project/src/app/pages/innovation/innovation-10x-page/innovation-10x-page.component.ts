import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '@pages/shared';
import { GlobalDocumentViewComponent } from '../../shared/abstract-classes/global-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-10x-page',
  template: `
    <div class="document" [nbSpinner]="loading" nbSpinnerStatus="disabled" [ngStyle]="loading ? {'min-height': '150px'} : {'height': '100%'}">
      <ng-container *ngIf="iframeUrl">
        <iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>
      </ng-container>
    </div>
  `,
})
export class Innovation10xComponent extends GlobalDocumentViewComponent implements OnInit {

  iframeUrl: SafeResourceUrl;

  loading: boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
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
      pageSize: 10,
      currentPageIndex: 0,
      app_global_ext_app_iframe: true,
      ecm_path: this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_FOLDER_TYPE,
      ecm_path_eq: this.documentPageService.getConfig('path:INNOVATION_10X_FOLDER_PATH'),
      ecm_fulltext: '',
      ecm_mixinType_not_in: '',
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
