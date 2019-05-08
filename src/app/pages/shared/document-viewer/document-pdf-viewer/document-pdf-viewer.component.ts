import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-pdf-viewer',
  styleUrls: ['./document-pdf-viewer.component.scss'],
  templateUrl: './document-pdf-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPdfViewerComponent {

  src: string[];

  @Input() imageAsViewer: boolean = true;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.src = doc.thumbnailUrl ? [doc.thumbnailUrl] : ['assets/images/default.jpg'];
    }
  }

}
