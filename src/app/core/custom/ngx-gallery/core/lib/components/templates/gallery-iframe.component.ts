import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'gallery-iframe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <iframe #iframe
            frameborder="0"
            allowfullscreen
            [src]="iframeSrc">
    </iframe>
  `,
})
export class GalleryIframeComponent implements OnInit {

  iframeSrc: SafeResourceUrl;

  @Input() src: string;

  @Input('pause') set pauseVideo(shouldPause: boolean) {
    const iframe: HTMLIFrameElement = this.iframe.nativeElement;
    if (shouldPause) {
      const src = iframe.src;
      iframe.src = src;
    }
  }

  @ViewChild('iframe') iframe: ElementRef;

  constructor(private _sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.iframeSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
}
