import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Environment } from '@environment/environment';

@Component({
  selector: 'backslash-pages',
  template: `
    <iframe [src]="iframeUrl" height="100%" width="100%" frameBorder="0"></iframe>
  `,
})
export class BackslashPageComponent {

  iframeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.iframeUrl = sanitizer.bypassSecurityTrustResourceUrl(Environment.backslashAppUrl);
  }

}
