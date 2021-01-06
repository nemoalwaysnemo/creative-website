import { Component, Input } from '@angular/core';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentViewerSettings } from '../document-video-viewer/document-viewer.interface';

@Component({
  selector: 'document-pdf-viewer',
  styleUrls: ['./document-pdf-viewer.component.scss'],
  templateUrl: './document-pdf-viewer.component.html',
})
export class DocumentPdfViewerComponent {

  viewerSettings: DocumentViewerSettings = new DocumentViewerSettings();

  @Input()
  set settings(settings: DocumentViewerSettings) {
    if (!isValueEmpty(settings)) {
      this.viewerSettings = settings;
    }
  }

}
