import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-viewer',
  styleUrls: ['./document-viewer.component.scss'],
  templateUrl: './document-viewer.component.html',
})
export class DocumentViewerComponent {

  @Input() document: DocumentModel;

  @Input() autoPlay: boolean = true;

  @Input() enableStoryboard: boolean = false;

  @Input() layout: 'dialogSlides' | 'slides' = 'slides';

  @Input() styleName: string;

  @Input() enableRelated: boolean = false;

  @Input() enableActions: boolean = true;

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
