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

  @Input() storyboard: boolean = false;

  @Input() layout: 'dialogSlides' | 'slides' = 'slides';

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
