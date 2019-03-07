import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-image-viewer',
  styleUrls: ['./document-image-viewer.component.scss'],
  templateUrl: './document-image-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentImageViewerComponent implements OnInit {

  src: string[];

  @Input() document: DocumentModel;
  @Input() forDailog: boolean;

  ngOnInit() {
    this.src = this.document.filePath ? [this.document.filePath] : ['assets/images/default.jpg'];
  }
}
