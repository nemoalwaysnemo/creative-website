import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseDocumentViewComponent } from '../shared/abstract-classes/base-document-view.component';
import { DocumentPageService } from '@pages/shared';
import { Environment } from '@environment/environment';

@Component({
  selector: 'backslash-remote-pages',
  template: `
    <iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>
  `,
})
export class BackslashRemotePageComponent extends BaseDocumentViewComponent {

  iframeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, protected documentPageService: DocumentPageService) {
    super(documentPageService);
    this.iframeUrl = sanitizer.bypassSecurityTrustResourceUrl(Environment.backslashAppUrl);
  }

  onInit(): void {
    this.setCurrentDocument(null);
  }

}
