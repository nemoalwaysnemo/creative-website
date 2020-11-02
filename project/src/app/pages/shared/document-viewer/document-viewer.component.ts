import { Component, Input, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentVideoSettings } from './document-video-viewer/document-video-player/document-video-player.interface';

@Component({
  selector: 'document-viewer',
  styleUrls: ['./document-viewer.component.scss'],
  templateUrl: './document-viewer.component.html',
})
export class DocumentViewerComponent implements OnInit {

  videoSettings: DocumentVideoSettings;

  @Input() document: DocumentModel;

  @Input() styleName: string;

  @Input() mute: boolean = false;

  @Input() autoplay: boolean = true;

  @Input() enableGlobalMute: boolean = false;

  @Input() enableStoryboard: boolean = false;

  @Input() layout: 'dialogSlides' | 'slides' = 'slides';

  ngOnInit(): void {
    this.videoSettings = new DocumentVideoSettings({
      mute: this.mute,
      autoplay: this.autoplay,
      enableGlobalMute: this.enableGlobalMute,
    });
  }

  getDocumentViewer(doc: DocumentModel): string {
    let type = 'unkonw';
    if (doc) {
      if (doc.isVideo()) {
        type = 'video';
      } else if (doc.isAudio()) {
        type = 'audio';
      } else if (doc.isPicture()) {
        type = 'picture';
      } else if (doc.isPdf()) {
        type = 'pdf';
      }
    }
    return type;
  }
}
