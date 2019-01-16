import { Component, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'tbwa-document-video-storyboard',
  styleUrls: ['./document-video-storyboard.component.scss'],
  templateUrl: './document-video-storyboard.component.html',
})
export class DocumentVideoStoryboardComponent implements OnChanges {

  @Input() storyboards: { source: any, time: number }[];

  constructor(private seekTime: DocumentVideoViewerService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.storyboards = this.storyboards.map((storyboard) => {
      return { source: storyboard.source, time: storyboard.time, minutes: this.timeToMinute(storyboard.time) };
    });
  }

  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  jumpToTimeline($event: any) {
    this.seekTime.setTime($event);
  }

  timeToMinute(time: number) {
    const transformTime = parseInt(time.toString(), 10);
    const minutes = Math.floor(transformTime / 60);
    const seconds = transformTime - minutes * 60;
    return minutes + ' : ' + seconds;
  }
}
