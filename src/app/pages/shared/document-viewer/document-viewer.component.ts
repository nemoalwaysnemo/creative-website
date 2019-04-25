import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-viewer',
  styleUrls: ['./document-viewer.component.scss'],
  templateUrl: './document-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent {

  @Input() document: DocumentModel;

  @Input() autoPlay: boolean = true;

  @Input() storyboard: boolean = true;

  @Input() imageAsViewer: boolean = true;

  @Input() layout: 'dialogSlides' | 'slides' = 'slides';

  @Input() ThumnailAnyway: boolean = false;

  getDocumentViewer(doc: DocumentModel): string {
    let type = 'unkonw';
    if (doc && this.ThumnailAnyway) {
      if (doc.hasThumnail()) {
        type = 'picture';
      } else if (doc.isPdf()) {
        type = 'picture'; // #160 BIG PDFs are slooooooow
      } else if (doc.isVideo()) {
        type = 'video';
      } else if (doc.isAudio()) {
        type = 'audio';
      }
    } else if ( doc ) {
      if (doc.isPicture()) {
        type = 'picture';
      } else if (doc.isPdf()) {
        type = 'picture'; // #160 BIG PDFs are slooooooow
      } else if (doc.isVideo()) {
        type = 'video';
      } else if (doc.isAudio()) {
        type = 'audio';
      }
    }
    return type;
  }
}
