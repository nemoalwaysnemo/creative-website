import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentModel } from '@core/api';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';

@Component({
  selector: 'tbwa-document-pdf-viewer',
  styleUrls: ['./docment-pdf-viewer.component.scss'],
  templateUrl: './docment-pdf-viewer.component.html',
})
export class DocumentPdfViewerComponent implements OnInit {
  src: string;
  @Input() document: DocumentModel;
  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  ngOnInit() {
    this.src = this.document.filePath;
    this.pdfViewer.zoomFullPage();
  }
}
