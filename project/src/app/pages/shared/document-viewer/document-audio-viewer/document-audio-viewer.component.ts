import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentViewerSettings } from '../document-video-viewer/document-viewer.interface';

@Component({
  selector: 'document-audio-viewer',
  styleUrls: ['./document-audio-viewer.component.scss'],
  templateUrl: './document-audio-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentAudioViewerComponent {

  audioSources: any[] = [];

  viewerSettings: DocumentViewerSettings = new DocumentViewerSettings();

  @Input()
  set settings(settings: DocumentViewerSettings) {
    if (!isValueEmpty(settings)) {
      this.viewerSettings = settings;
      this.audioSources = this.getAudioSources(settings.document);
    }
  }

  private getAudioSources(doc: DocumentModel): any[] {
    const content = (doc.get('file:content') || {});
    return [{ src: content.data, type: content['mime-type'] }];
  }
}
