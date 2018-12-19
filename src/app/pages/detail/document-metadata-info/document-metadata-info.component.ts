import { Component, OnInit, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-metadata-info',
  styleUrls: ['./document-metadata-info.component.scss'],
  templateUrl: './document-metadata-info.component.html',
})
export class DocumentMetadataInfoComponent implements OnInit {

  @Input() document: DocumentModel;

  constructor() { }

  ngOnInit() {
  }
}
