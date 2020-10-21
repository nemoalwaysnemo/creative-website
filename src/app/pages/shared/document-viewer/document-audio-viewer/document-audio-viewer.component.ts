import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-audio-viewer',
  styleUrls: ['./document-audio-viewer.component.scss'],
  templateUrl: './document-audio-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentAudioViewerComponent {

  audioSource: any[] = [];

  controls: string = 'controls';

  documentModel: DocumentModel;

  @Input() styleName: string;

  @Input() autoPlay: boolean = true;

  @Input()
  set document(doc: DocumentModel) {
    this.documentModel = doc;
    this.buildAudioInfo(doc);
  }

  private buildAudioInfo(doc: DocumentModel): void {
    const audioSourceContent = (doc.get('file:content') || {});
    this.audioSource = [{ src: audioSourceContent.data, type: audioSourceContent['mime-type'] }];
  }
}
