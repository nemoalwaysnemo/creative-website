import { Component, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
import { SimplePdfViewerComponent } from 'simple-pdf-viewer';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-pdf-viewer',
  styleUrls: ['./document-pdf-viewer.component.scss'],
  templateUrl: './document-pdf-viewer.component.html',
})
export class DocumentPdfViewerComponent implements OnChanges {

  filePath: string;

  @Input() document: DocumentModel;

  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  ngOnChanges(changes: SimpleChanges) {
    this.filePath = this.document.get('file:content').data;
    this.pdfViewer.zoomFullPage();
  }
}
