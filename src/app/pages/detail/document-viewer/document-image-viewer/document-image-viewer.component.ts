import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-image-viewer',
  styleUrls: ['./document-image-viewer.component.scss'],
  templateUrl: './document-image-viewer.component.html',
})
export class DocumentImageViewerComponent implements OnInit {
  @Input() document: DocumentModel;
  src: string[];

  ngOnInit() {
    this.src = [this.document.get('file:content').data];
  }
}
