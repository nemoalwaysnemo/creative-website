import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'tbwa-document-video-viewer',
  styleUrls: ['./document-video-viewer.component.scss'],
  templateUrl: './document-video-viewer.component.html',
})
export class DocumentVideoViewerComponent implements OnInit {
  @Input() filePath: string;
  @Input() poster: string;
  @Input() storyboards: object;
  ngOnInit() {
    console.info(this.filePath);
  }
}
