import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
})
export class DocumentVideoViewerComponent implements OnChanges {

  poster: string;

  videoSources: { source: any, type: string }[];

  storyboards: { source: any, time: number }[];

  @Input() document: DocumentModel;

  ngOnChanges(changes: SimpleChanges) {
    this.buildVideoInfo();
  }

  private buildVideoInfo(): void {
    this.poster = this.document.videoPoster;
    const sources = this.document.get('vid:transcodedVideos');
    this.videoSources = sources.map((source) => {
      return { source: source.content.data, type: source.content['mime-type'] };
    });
    const storyData = this.document.properties['vid:storyboard'];
    this.storyboards = storyData.map((source) => {
      return { source: source.content.data, time: source.timecode };
    });
  }
}
