import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { DragScrollComponent } from 'ngx-drag-scroll';
@Component({
  selector: 'tbwa-document-video-storyboard',
  styleUrls: ['./document-video-storyboard.component.scss'],
  templateUrl: './document-video-storyboard.component.html',
})
export class DocumentVideoStoryboardComponent implements OnInit {

  @Input() storyboards: { source: any, time: string | number }[];

  constructor(private seekTime: DocumentVideoViewerService) { }

  ngOnInit() {
    this.storyboards = this.storyboards.map((storyboard) => {
      return { source: storyboard.source, time: storyboard.time, minutes: this.timeToMinute(storyboard.time) };
    });
  }

  @ViewChild ( 'nav', { read: DragScrollComponent } ) ds: DragScrollComponent;

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  jumpToTimeline($event) {
    this.seekTime.setTime($event);
  }

  timeToMinute(time) {
    const transformTime = parseInt(time, 10);
    const minutes = Math.floor(transformTime / 60);
    const seconds = transformTime - minutes * 60;
    return minutes + ' : ' + seconds;
  }
}
