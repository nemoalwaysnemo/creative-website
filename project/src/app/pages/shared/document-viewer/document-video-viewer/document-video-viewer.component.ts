import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentViewerSettings } from '../document-viewer.interface';

@Component({
  selector: 'document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoViewerComponent {

  viewerSettings: DocumentViewerSettings = new DocumentViewerSettings();

  @Input()
  set settings(settings: DocumentViewerSettings) {
    if (!isValueEmpty(settings)) {
      this.viewerSettings = settings;
    }
  }

}
