import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'tbwa-document-video-storyboard',
  styleUrls: ['./document-video-storyboard.component.scss'],
  templateUrl: './document-video-storyboard.component.html',
})
export class DocumentVideoStoryboardComponent implements OnInit {

  @Input() storyboards: { source: any, time: number }[];

  constructor(private seekTime: DocumentVideoViewerService) { }

  ngOnInit() {
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
    return this.prefixInteger(minutes) + ' : ' + this.prefixInteger(seconds);
  }

  prefixInteger(num) {
    return (Array(2).join('0') + num).slice(-2);
  }
}
