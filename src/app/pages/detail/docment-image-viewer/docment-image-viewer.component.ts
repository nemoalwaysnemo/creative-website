import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentModel } from '@core/api';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';

@Component({
  selector: 'tbwa-document-image-viewer',
  styleUrls: ['./docment-image-viewer.component.scss'],
  templateUrl: './docment-image-viewer.component.html',
})
export class DocumentImageViewerComponent implements OnInit {
  src: string;
  @Input() document: DocumentModel;
  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  ngOnInit() {
    this.src = this.document.filePath;
    this.pdfViewer.zoomFullPage();
  }
}
