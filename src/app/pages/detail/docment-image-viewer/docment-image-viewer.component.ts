import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-image-viewer',
  styleUrls: ['./docment-image-viewer.component.scss'],
  templateUrl: './docment-image-viewer.component.html',
})
export class DocumentImageViewerComponent implements OnInit {
  @Input() document: DocumentModel;
  src: string[];

  ngOnInit() {
    this.src = [this.document.filePath];
    // this.src = './asset/example/rails.png';
  }
}
