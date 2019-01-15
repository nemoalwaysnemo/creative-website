import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-image-viewer',
  styleUrls: ['./document-image-viewer.component.scss'],
  templateUrl: './document-image-viewer.component.html',
})
export class DocumentImageViewerComponent implements OnChanges {

  src: string[];

  @Input() document: DocumentModel;

  ngOnChanges(changes: SimpleChanges) {
    this.src = [this.document.get('file:content').data];
  }
}
