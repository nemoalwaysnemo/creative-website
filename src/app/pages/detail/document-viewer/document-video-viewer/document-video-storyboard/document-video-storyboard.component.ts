import { Component, Input } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';

@Component({
  selector: 'tbwa-document-video-storyboard',
  styleUrls: ['./document-video-storyboard.component.scss'],
  templateUrl: './document-video-storyboard.component.html',
})
export class DocumentVideoStoryboardComponent {

  @Input() storyboards: { source: any, time: string | number }[];

  constructor(private seekTime: DocumentVideoViewerService) { }

  jumpToTimeline($event) {
    this.seekTime.setTime($event);
  }

  timecodeToTime(code: number) {
  }
}
