import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentVideoViewerService } from '../document-video-viewer.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'tbwa-document-video-storyboard',
  styleUrls: ['./document-video-storyboard.component.scss'],
  templateUrl: './document-video-storyboard.component.html',
})
export class DocumentVideoStoryboardComponent implements OnInit {
  @Input() filePath: string;
  @Input() storyboards: object;
  constructor(private seekTime: DocumentVideoViewerService) { }
  ngOnInit() {
  }
  jumpToTimeline($event) {
    this.seekTime.setTime($event);
  }
}
