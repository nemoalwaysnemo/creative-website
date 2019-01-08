import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SimplePdfViewerComponent } from 'simple-pdf-viewer';

@Component({
  selector: 'tbwa-document-pdf-viewer',
  styleUrls: ['./document-pdf-viewer.component.scss'],
  templateUrl: './document-pdf-viewer.component.html',
})
export class DocumentPdfViewerComponent implements OnInit {
  @Input() filePath: string;
  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  ngOnInit() {
    this.pdfViewer.zoomFullPage();
  }
}
