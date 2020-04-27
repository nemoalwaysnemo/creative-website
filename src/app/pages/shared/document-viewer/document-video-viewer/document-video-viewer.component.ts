import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoViewerComponent {

  poster: string;

  documentModel: DocumentModel;

  videoSources: { url: any, type: string }[];

  @Input() styleName: string;

  @Input()
  set document(doc: DocumentModel) {
    this.documentModel = doc;
    this.buildVideoInfo(doc);
  }

  @Input() autoPlay: boolean = false;

  @Input() enableStoryboard: boolean = true;

  private buildVideoInfo(doc: DocumentModel): void {
    this.poster = doc.videoPoster;
    this.videoSources = doc.getVideoSources();
  }
}
