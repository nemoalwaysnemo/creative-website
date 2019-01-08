import { Component, OnInit, Input  } from '@angular/core';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-viewer',
  styleUrls: ['./document-viewer.component.scss'],
  templateUrl: './document-viewer.component.html',
})
export class DocumentViewerComponent implements OnInit {
  @Input() document: DocumentModel;
  fileType: string;
  filePath: string;

  ngOnInit() {
    this.filePath = this.document.filePath;
    this.fileType = this.document.fileType;
  }

  isPdf(): boolean {
    return this.fileType === 'application/pdf';
  }
}
