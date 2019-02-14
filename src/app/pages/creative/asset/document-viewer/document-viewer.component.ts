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
      case 'audio': {
        return this.isAudio();
      }
      default: {
        return false;
      }
    }
  }

  private isPdf(): boolean {
    return this.document.fileMimeType === 'application/pdf';
  }

  private isImage(): boolean {
    return this.document.isPicture() && !this.isPdf();
  }

  private isVideo(): boolean {
    return this.document.isVideo();
  }

  private isAudio(): boolean {
    return this.document.isAudio();
  }

}
