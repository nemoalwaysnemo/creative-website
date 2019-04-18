import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-viewer',
  styleUrls: ['./document-viewer.component.scss'],
  templateUrl: './document-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent {

  @Input() document: DocumentModel;

  @Input() autoPlay: boolean = true;

  @Input('forDailog')
  set forDailog(forDailog) {
    this._forDailog = forDailog;
    this.layout = forDailog ? ' dialogSlides' : 'slides';
  }

  layout: string;
  _forDailog: boolean;

  getDocumentViewer(doc: DocumentModel): string {
    let type = 'unkonw';
    if (doc) {
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
