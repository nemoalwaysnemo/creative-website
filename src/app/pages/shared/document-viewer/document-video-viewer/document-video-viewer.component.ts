import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoViewerComponent implements OnInit {

  poster: string;

  videoSources: { url: any, type: string }[];

  @Input() document: DocumentModel;

  @Input() autoPlay: boolean = false;

  @Input() storyboard: boolean = true;

  ngOnInit() {
    this.buildVideoInfo();
  }

  private buildVideoInfo(): void {
    this.poster = this.document.videoPoster;
    this.videoSources = this.document.getVideoSources();
  }
}
