import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentViewerSettings } from '../document-viewer.interface';

@Component({
  selector: 'document-image-viewer',
  styleUrls: ['./document-image-viewer.component.scss'],
  templateUrl: './document-image-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentImageViewerComponent {

  viewerSettings: DocumentViewerSettings = new DocumentViewerSettings();

  @Input()
  set settings(settings: DocumentViewerSettings) {
    if (!isValueEmpty(settings)) {
      this.viewerSettings = settings;
    }
  }

}
