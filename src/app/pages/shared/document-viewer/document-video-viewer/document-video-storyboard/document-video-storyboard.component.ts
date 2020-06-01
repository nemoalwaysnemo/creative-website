import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DocumentVideoViewerService, DocumentVideoEvent } from '../document-video-viewer.service';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-video-storyboard',
  styleUrls: ['./document-video-storyboard.component.scss'],
  templateUrl: './document-video-storyboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentVideoStoryboardComponent implements OnInit {

  @Input() document: DocumentModel;

  storyboards: { source: any, time: number }[] = [];

  @ViewChild('nav', { static: true, read: DragScrollComponent }) ds: DragScrollComponent;

  constructor(private documentVideoViewerService: DocumentVideoViewerService) { }

  ngOnInit(): void {
    const storyData = this.document.get('vid:storyboard') || [];
    this.storyboards = storyData.map((source) => {
      return { source: source.content.data, time: source.timecode, minutes: this.timeToMinute(source.timecode) };
    });
  }

  getDocumentType(): string {
    return this.document ? this.document.type.toLowerCase() : '';
  }

  moveLeft(): void {
    this.ds.moveLeft();
  }

  moveRight(): void {
    this.ds.moveRight();
  }

  jumpToTimeline(currentTime: any): void {
    this.documentVideoViewerService.triggerEvent(new DocumentVideoEvent({ name: 'currentTimeChanged', currentTime }));
  }

  timeToMinute(time: number): string {
    const transformTime = parseInt(time.toString(), 10);
    const minutes = Math.floor(transformTime / 60);
    const seconds = transformTime - minutes * 60;
    return this.prefixInteger(minutes) + ' : ' + this.prefixInteger(seconds);
  }

  prefixInteger(num: number): any {
    return (Array(2).join('0') + num).slice(-2);
  }
}
