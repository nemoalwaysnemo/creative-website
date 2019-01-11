import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'tbwa-document-video-player',
  styleUrls: ['./document-video-player.component.scss'],
  templateUrl: './document-video-player.component.html',
})
export class DocumentVideoPlayerComponent implements OnInit {
  @Input() filePath: string;
  @Input() poster: string;
  ngOnInit() {
  }
}
