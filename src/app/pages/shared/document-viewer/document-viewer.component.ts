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

  getDocumentViewer(): string {
    let type = 'unkonw';
    if (this.document.isPicture()) {
      type = 'picture';
    } else if (this.document.isPdf()) {
      type = 'pdf';
    } else if (this.document.isVideo()) {
      type = 'video';
    } else if (this.document.isAudio()) {
      type = 'audio';
    }
    return type;
  }

}
