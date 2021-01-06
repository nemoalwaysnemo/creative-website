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

  audioSource: any[] = [];

  viewerSettings: DocumentViewerSettings = new DocumentViewerSettings();

  @Input()
  set settings(settings: DocumentViewerSettings) {
    if (!isValueEmpty(settings)) {
      this.viewerSettings = settings;
      this.buildAudioInfo(settings.document);
    }
  }

  private buildAudioInfo(doc: DocumentModel): void {
    const audioSourceContent = (doc.get('file:content') || {});
    this.audioSource = [{ src: audioSourceContent.data, type: audioSourceContent['mime-type'] }];
  }
}
