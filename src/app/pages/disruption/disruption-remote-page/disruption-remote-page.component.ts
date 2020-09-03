import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { GlobalDocumentViewComponent } from '../../shared/abstract-classes/global-document-view.component';
import { DocumentPageService } from '@pages/shared';
import { Environment, EXTERNAL_LINK } from '@environment/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'knowledge-remote-page',
  template: `
    <div class="document" [nbSpinner]="loading" nbSpinnerStatus="disabled" [ngStyle]="loading ? {'min-height': '150px'} : {'height': '100%'}">
      <ng-container *ngIf="iframeUrl">
        <iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>
      </ng-container>
    </div>
  `,
})
export class DisruptionRemotePageComponent extends BaseDocumentViewComponent {

  iframeUrl: SafeResourceUrl;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    protected documentPageService: DocumentPageService) {
      super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.buildIframeUrl();
  }

  private buildIframeUrl(): void {
    if (this.router.url.split('/').slice(-1).pop() === 'help') {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(EXTERNAL_LINK.KNOWLEDGE_GUIDE_URL);
    }
  }
}
