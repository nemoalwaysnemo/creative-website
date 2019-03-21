import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoViewerComponent implements OnInit {

  poster: string;

  videoSources: { url: any, type: string }[];

  @Input() document: DocumentModel;
  @Input() forDailog: boolean;
  @Input() autoPlay: boolean = false;

  ngOnInit() {
    this.buildVideoInfo();
  }

  private buildVideoInfo(): void {
    this.poster = this.document.videoPoster;
    this.videoSources = this.document.getVideoSources();
  }
}
