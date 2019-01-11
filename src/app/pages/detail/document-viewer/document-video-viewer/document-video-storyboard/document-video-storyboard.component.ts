import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'tbwa-document-video-storyboard',
  styleUrls: ['./document-video-storyboard.component.scss'],
  templateUrl: './document-video-storyboard.component.html',
})
export class DocumentVideoStoryboardComponent implements OnInit {
  @Input() filePath: string;
  @Input() storyboards: object;
  ngOnInit() {
  }
}
