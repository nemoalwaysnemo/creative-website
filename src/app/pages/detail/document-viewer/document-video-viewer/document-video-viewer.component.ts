import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
})
export class DocumentVideoViewerComponent implements OnChanges {

  poster: string;

  videoSources: { url: any, type: string }[];

  storyboards: { source: any, time: number }[];

  @Input() document: DocumentModel;

  ngOnChanges(changes: SimpleChanges) {
    this.buildVideoInfo();
  }

  private buildVideoInfo(): void {
    this.poster = this.document.videoPoster;
    this.videoSources = this.document.getVideoSources();
    const storyData = this.document.properties['vid:storyboard'];
    this.storyboards = storyData.map((source) => {
      return { source: source.content.data, time: source.timecode };
    });
  }
}
