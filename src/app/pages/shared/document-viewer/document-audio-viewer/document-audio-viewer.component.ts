import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-audio-viewer',
  styleUrls: ['./document-audio-viewer.component.scss'],
  templateUrl: './document-audio-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentAudioViewerComponent implements OnInit {

  audioSource: any;

  @Input() document: DocumentModel;

  ngOnInit() {
    const audioSourceContent = (this.document.get('file:content') || []);
    this.audioSource = [{ src: audioSourceContent.data, type: audioSourceContent['mime-type'] }];
  }
}
