import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'tbwa-document-image-viewer',
  styleUrls: ['./document-image-viewer.component.scss'],
  templateUrl: './document-image-viewer.component.html',
})
export class DocumentImageViewerComponent implements OnInit {
  @Input() filePath: string;
  src: string[];

  ngOnInit() {
    this.src = [this.filePath];
  }
}
