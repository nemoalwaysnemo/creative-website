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
  fileMimeType: string;
  filePath: string;
  ngOnInit() {
    this.filePath = this.document.get('file:content').data;
    this.fileMimeType = this.document.fileMimeType;
  }

  documentTypeIs(type: string): boolean {
    switch (type) {
      case 'pdf': {
        return this.isPdf();
      }
      case 'image': {
        return this.isImage();
      }
      case 'video': {
        return this.isVideo();
      }
      default: {
      }
    }
  }

  private isPdf(): boolean {
    return this.fileMimeType === 'application/pdf';
  }

  private isImage(): boolean {
    return this.document.isPicture() && !this.isPdf();
  }

  private isVideo(): boolean {
    return this.document.isVideo();
  }

}
