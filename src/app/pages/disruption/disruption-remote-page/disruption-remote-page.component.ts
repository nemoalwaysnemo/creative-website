import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { DocumentPageService } from '@pages/shared';
import { EXTERNAL_LINK } from '@environment/environment';

@Component({
  selector: 'disruption-remote-page',
  template: `
    <ng-container *ngIf="iframeUrl">
      <iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>
    </ng-container>
  `,
})
export class DisruptionRemotePageComponent extends BaseDocumentViewComponent {

  iframeUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.setCurrentDocument();
    this.buildIframeUrl();
  }

  private buildIframeUrl(): void {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(EXTERNAL_LINK.KNOWLEDGE_GUIDE_URL);
  }
}
