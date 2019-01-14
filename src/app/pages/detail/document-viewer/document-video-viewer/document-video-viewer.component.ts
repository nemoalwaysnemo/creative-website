import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
})
export class DocumentVideoViewerComponent implements OnInit {
  @Input() filePath: string;
  @Input() document: DocumentModel;
  videoSources: object;
  poster: string;
  storyboards: object;
  ngOnInit() {
    const sources = this.document.get('vid:transcodedVideos');
    this.videoSources = Object.keys(sources).map(function (key) {
      return { 'source' : sources[key].content.data , 'type' : sources[key].content['mime-type'] };
    });
    this.poster = this.document.videoPoster;
    const storyData = this.document.properties['vid:storyboard'];
    this.storyboards = Object.keys(storyData).map(function (key) {
      return { 'source': storyData[key].content.data, 'time': storyData[key].timecode };
    });
  }
}
