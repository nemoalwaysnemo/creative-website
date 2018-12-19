import { Component, OnInit, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-additional-info',
  styleUrls: ['./document-additional-info.component.scss'],
  templateUrl: './document-additional-info.component.html',
})
export class DocumentAdditionalInfoComponent implements OnInit {

  @Input() document: DocumentModel;

  constructor() { }

  ngOnInit() {
  }
}
