import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-document-additional-info',
  styleUrls: ['./document-additional-info.component.scss'],
  templateUrl: './document-additional-info.component.html',
})
export class DocumentAdditionalInfoComponent {

  @Input() document: DocumentModel;

  constructor() { }

}
