import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-image-viewer',
  styleUrls: ['./document-image-viewer.component.scss'],
  templateUrl: './document-image-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentImageViewerComponent {

  src: string[];

  @Input() imageAsViewer: boolean = true;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.src = doc.thumbnailUrl ? [doc.thumbnailUrl] : ['assets/images/default.jpg'];
    }
  }

}
